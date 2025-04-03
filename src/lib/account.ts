import axios from "axios";
import type {
  SyncUpdatedResponse,
  SyncResponse,
  EmailMessage,
  EmailAddress,
} from "./types";
import { resolve } from "path";
import { db } from "@/server/db";
import { syncEmailsToDatabase } from "./sync-to-db";

export class Account {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async startSync() {
    // Make a POST request to Aurinko's email sync API endpoint
    const response = await axios.post<SyncResponse>(
      "https://api.aurinko.io/v1/email/sync",
      {}, // Empty request body (config is passed via params)
      {
        headers: {
          // Authentication using the stored bearer token
          Authorization: `Bearer ${this.token}`,
        },
        params: {
          // Sync emails from the last 2 days only (reduces load)
          daysWithin: 2,
          // Request email bodies in HTML format (alternative: "text")
          bodyType: "html",
        },
      },
    );

    // Return the parsed response data (typed as SyncResponse)
    return response.data;
  }
  //Possible that either deltaToken or pageToken or both are passed
  async getUpdatedEmails({
    deltaToken,
    pageToken,
  }: {
    deltaToken?: string;
    pageToken?: string;
  }) {
    console.log("getUpdatedEmails", { deltaToken, pageToken });
    let params: Record<string, string> = {};
    if (deltaToken) params.deltaToken = deltaToken;
    if (pageToken) params.pageToken = pageToken;

    const response = await axios.get<SyncUpdatedResponse>(
      "https://api.aurinko.io/v1/email/sync/updated",
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params,
      },
    );
    return response.data;
  }

  async performInitialSync() {
    try {
      //start the sync process
      let syncResponse = await this.startSync();

      //Make sure sync response is ready in order to receive a delta token from aurinko
      while (!syncResponse.ready) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        syncResponse = await this.startSync();
      }

      console.log("Sync is ready. Tokens:", syncResponse);

      //get the delta token/bookmark from aurinko
      let storedDeltaToken: string = syncResponse.syncUpdatedToken;

      let updatedResponse = await this.getUpdatedEmails({
        deltaToken: storedDeltaToken,
      });
      console.log("updatedResponse", updatedResponse);

      if (updatedResponse.nextDeltaToken) {
        //If there is a next Delta token, means that the sync has been completed
        //Keep track of the latestDeltaToken
        storedDeltaToken = updatedResponse.nextDeltaToken;
      }

      let allEmails: EmailMessage[] = updatedResponse.records;

      //Fetch all pages within the days provided if there are more
      while (updatedResponse.nextPageToken) {
        updatedResponse = await this.getUpdatedEmails({
          pageToken: updatedResponse.nextPageToken,
        });
        allEmails = allEmails.concat(updatedResponse.records);

        if (updatedResponse.nextDeltaToken) {
          //sync has ended
          storedDeltaToken = updatedResponse.nextDeltaToken;
        }
      }
      console.log(
        "Initial sync completed, we have synced",
        allEmails.length,
        " emails",
      );

      //store the latest delta token for future incremental syncs
      //   await this.getUpdatedEmails({deltaToken:storedDeltaToken})

      return {
        emails: allEmails,
        deltaToken: storedDeltaToken,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error during sync: ",
          JSON.stringify(error.response?.data, null, 2),
        );
      } else {
        console.error("Error during sync: ", error);
      }
    }
  }

  async sendEmail({
    from,
    subject,
    body,
    inReplyTo,
    references,
    threadId,
    to,
    cc,
    bcc,
    replyTo,
  }: {
    from: EmailAddress;
    subject: string;
    body: string;
    inReplyTo?: string;
    references?: string;
    threadId?: string;
    to: EmailAddress[];
    cc?: EmailAddress[];
    bcc?: EmailAddress[];
    replyTo?: EmailAddress;
  }) {
    try {
      // Make a POST request to the Aurinko API to send the email
      const response = await axios.post(
        `https://api.aurinko.io/v1/email/messages`,
        {
          // Required fields
          from,       // Sender's email address
          subject,    // Email subject line
          body,       // Email body content
          // Optional fields for threading/replies
          inReplyTo,  // Message-ID of the email this is replying to
          references, // References header for email threading
          threadId,   // Thread identifier (if applicable)
          // Recipient fields
          to,        // Primary recipients (required)
          cc,         // Carbon copy recipients (optional)
          bcc,        // Blind carbon copy recipients (optional)
          replyTo: [replyTo], // Reply-To address (wrapped in array per API spec)
        },
        {
          // Query parameters
          params: {
            returnIds: true, // Request the API to return message IDs
          },
          // Authentication headers
          headers: { 
            Authorization: `Bearer ${this.token}`, // API access token
          },
        },
      );

      // Log successful send for debugging
      console.log("sendmail", response.data);
      
      // Return the API response (typically includes message IDs)
      return response.data;
    } catch (error) {
      // Handle Axios-specific errors (e.g., HTTP 4xx/5xx responses)
      if (axios.isAxiosError(error)) {
        console.error(
          "Error sending email:",
          JSON.stringify(error.response?.data, null, 2), // Pretty-print API error response
        );
      } else {
        // Handle non-Axios errors (e.g., network failures)
        console.error("Error sending email:", error);
      }
      // Re-throw to allow calling code to handle the failure
      throw error;
    }
  }
  async syncEmails() {
    // Fetch the account record from the database using the access token
    const account = await db.account.findUnique({
      where: { accessToken: this.token },
    });

    // Validate if the account exists and is ready for sync
    if (!account) throw new Error("Account not found");
    if (!account.nextDeltaToken) throw new Error("Account not ready for sync");

    // Fetch the first batch of updated emails using the stored delta token
    let response = await this.getUpdatedEmails({
      deltaToken: account.nextDeltaToken,
    });

    // Store the initial delta token (used for tracking sync progress)
    let storedDeltaToken = account.nextDeltaToken;
    
    // Initialize the list of emails with the first batch of records
    let allEmails: EmailMessage[] = response.records;

    // Update the delta token if a new one is provided in the response
    if (response.nextDeltaToken) {
      storedDeltaToken = response.nextDeltaToken;
    }

    // If there are more pages of emails, fetch them iteratively
    while (response.nextPageToken) {
      // Fetch the next batch of emails using the page token
      response = await this.getUpdatedEmails({
        pageToken: response.nextPageToken,
      });

      // Merge the new records with the existing ones
      allEmails = allEmails.concat(response.records);

      // Update delta token if a new one is received (for paginated sync)
      if (response.nextDeltaToken) {
        storedDeltaToken = response.nextDeltaToken;
      }
    }

    // Attempt to sync all fetched emails to the database
    try {
      syncEmailsToDatabase(allEmails, account.id);
    } catch (error) {
      console.error("Error during Email sync: ", error);
    }

    // After successful sync, update the account's delta token in the database
    // This ensures the next sync starts from the correct point
    await db.account.update({
      where: {
        id: account.id,
      },
      data: {
        nextDeltaToken: storedDeltaToken,
      },
    });

    // Return the synced emails and the latest delta token for reference
    return {
      emails: allEmails,
      deltaToken: storedDeltaToken,
    };
  }
}
