import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "@/server/db";
import type { Prisma } from "@prisma/client";
import { emailAddressSchema } from "@/lib/types";
import { Account } from "@/lib/account";
import { access } from "fs/promises";
import { OramaClient } from "@/lib/orama";
import { FREE_CREDITS_PER_DAY } from "@/app/constants";

export const authoriseAccountAccess = async (
  accountId: string,
  userId: string,
) => {
  const account = await db.account.findFirst({
    where: {
      id: accountId,
      userId: userId,
    },
    select: {
      id: true,
      emailAddress: true,
      name: true,
      accessToken: true,
    },
  });
  // console.log("UserId: ", userId)
  // console.log("AccountId: ", accountId)
  if (!account) throw new Error("Account not found");
  return account;
};

const inboxFilter = (accountId: string): Prisma.ThreadWhereInput => ({
  accountId,
  inboxStatus: true,
  isTrashed: false, // Important: exclude trashed threads
});

const sentFilter = (accountId: string): Prisma.ThreadWhereInput => ({
  accountId,
  sentStatus: true,
});

const draftFilter = (accountId: string): Prisma.ThreadWhereInput => ({
  accountId,
  draftStatus: true,
  inboxStatus: false,
  sentStatus: false,
});

const archiveFilter = (accountId: string): Prisma.ThreadWhereInput => ({
  accountId,
  isArchived: true,
  isTrashed: false, // Archived threads shouldn't be in trash
});

const trashFilter = (accountId: string): Prisma.ThreadWhereInput => ({
  accountId,
  isTrashed: true,
});

const starFilter = (accountId: string): Prisma.ThreadWhereInput => ({
  accountId,
  isStarred: true,
});

export const accountRouter = createTRPCRouter({
  getAccounts: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.account.findMany({
      where: {
        userId: ctx.prismaUserId,
      },
      select: {
        id: true,
        emailAddress: true,
        name: true,
      },
    });
  }),

  getNumThreads: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        tab: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Safety check for empty accountId
      if (!input.accountId) {
        console.log("Empty accountId provided");
        return 0;
      }

      try {
        const account = await authoriseAccountAccess(
          input.accountId,
          ctx.prismaUserId!,
        );

        let filter: Prisma.ThreadWhereInput = {};

        // Standardize tab names
        if (input.tab === "inbox") {
          filter = inboxFilter(account.id);
        } else if (input.tab === "sent") {
          filter = sentFilter(account.id);
        } else if (input.tab === "drafts" || input.tab === "draft") {
          // Handle both variations
          filter = draftFilter(account.id);
        }

        // console.log("Applied filter:", JSON.stringify(filter, null, 2));

        // Fetch the actual records to debug
        const threads = await ctx.db.thread.findMany({
          where: filter,
          select: {
            id: true,
            inboxStatus: true,
            sentStatus: true,
            draftStatus: true,
          },
        });

        // console.log("Fetched Threads:", threads);

        // Now count them
        return threads.length;
      } catch (error) {
        console.error("Error in getNumThreads:", error);
        return 0; // Return 0 on error
      }
    }),

  // Add this procedure to your accountRouter to debug the issue
  debugThreads: protectedProcedure
    .input(z.object({ accountId: z.string() }))
    .query(async ({ ctx, input }) => {
      // First verify the account exists and belongs to the user
      const account = await ctx.db.account.findFirst({
        where: {
          id: input.accountId,
          userId: ctx.prismaUserId,
        },
      });

      console.log("Found account:", account);

      if (!account) {
        return { error: "Account not found or doesn't belong to this user" };
      }

      // Now get all threads regardless of filters
      const allThreads = await ctx.db.thread.findMany({
        where: {
          // Use only accountId to get all threads
          accountId: input.accountId,
        },
        select: {
          id: true,
          subject: true,
          inboxStatus: true,
          sentStatus: true,
          draftStatus: true,
        },
      });

      // Try with direct prisma client if still no results
      const directThreads = await db.thread.findMany({
        where: { accountId: input.accountId },
        select: {
          id: true,
          subject: true,
          inboxStatus: true,
          sentStatus: true,
          draftStatus: true,
        },
      });

      // Count threads by status
      const countsByStatus = {
        total: allThreads.length,
        inbox: allThreads.filter((t) => t.inboxStatus).length,
        sent: allThreads.filter((t) => t.sentStatus).length,
        drafts: allThreads.filter((t) => t.draftStatus).length,
      };

      // Check if any threads exist at all in the database
      const totalThreadsInDb = await ctx.db.thread.count();

      return {
        account,
        allThreads,
        directThreads,
        countsByStatus,
        totalThreadsInDb,
        message:
          allThreads.length === 0
            ? "No threads found for this account"
            : "Threads found",
      };
    }),

  // Add this procedure to your accountRouter
  findThreadAccounts: protectedProcedure.query(async ({ ctx }) => {
    // Get all threads in the database
    const threads = await ctx.db.thread.findMany({
      select: {
        id: true,
        accountId: true,
        subject: true,
        inboxStatus: true,
        sentStatus: true,
        draftStatus: true,
      },
    });

    // Get all accounts for the current user
    const userAccounts = await ctx.db.account.findMany({
      where: { userId: ctx.prismaUserId },
      select: { id: true, emailAddress: true, name: true },
    });

    // Map of account IDs to account details
    const accountMap = userAccounts.reduce(
      (acc, account) => {
        acc[account.id] = account;
        return acc;
      },
      {} as Record<string, (typeof userAccounts)[0]>,
    );

    // Group threads by account ID
    const threadsByAccount = threads.reduce(
      (acc, thread) => {
        if (!acc[thread.accountId]) {
          acc[thread.accountId] = [];
        }
        acc[thread.accountId]!.push(thread);
        return acc;
      },
      {} as Record<string, typeof threads>,
    );

    return {
      userAccounts,
      threadsByAccount,
      accountMap,
      message:
        threads.length > 0
          ? "Found threads associated with these accounts"
          : "No threads found in the database",
    };
  }),

  getThreads: protectedProcedure
  .input(
    z.object({
      accountId: z.string(),
      tab: z.string(),
      done: z.boolean(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const account = await authoriseAccountAccess(
      input.accountId,
      ctx.prismaUserId!,
    );
    if (!account) throw new Error("Invalid token");
    
    // Sync emails (keep your existing sync logic)
    const acc = new Account(account.accessToken);
    await acc.syncEmails().catch(console.error);

    // Create base filter with account ID
    let filter: Prisma.ThreadWhereInput = { accountId: account.id };

    // console.log("Filtering threads for tab: ", input.tab)

    // Handle different tab filters
    switch (input.tab) {
      case "inbox":
        filter.inboxStatus = true;
        filter.isTrashed = false; // Exclude trashed threads from inbox
        break;
      case "sent":
        filter.sentStatus = true;
        break;
      case "drafts":
        filter.draftStatus = true;
        break;
      case "archive": // Archive
        filter.isArchived = true;
        filter.isTrashed = false; // Archived threads shouldn't be in trash
        break;
      case "trash":
        filter.isTrashed = true;
        break;
      case "star":
        filter.isStarred = true;
        break;
      case 'unread':
        filter.isRead = false;
        break;
    }

    // Add done filter (keep your existing done filter logic)
    // filter.done = {
    //   equals: input.done,
    // };
    const results =await ctx.db.thread.findMany({
      where: filter,
      include: {
        emails: {
          orderBy: {
            sentAt: "asc",
          },
          select: {
            from: true,
            body: true,
            bodySnippet: true,
            emailLabel: true,
            subject: true,
            sysLabels: true,
            id: true,
            sentAt: true,
          },
        },
      },
      take: 15,
      orderBy: {
        lastMessageDate: "desc",
      },
    });
    return results
  }),

  getSuggestions: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const account = await authoriseAccountAccess(
        input.accountId,
        ctx.prismaUserId!,
      );
      return await ctx.db.emailAddress.findMany({
        where: {
          accountId: account.id,
        },
        select: {
          address: true,
          name: true,
        },
      });
    }),

    getReplyDetails: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        threadId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const account = await authoriseAccountAccess(
        input.accountId,
        ctx.prismaUserId!,
      );
      
      const thread = await ctx.db.thread.findFirst({
        where: {
          id: input.threadId,
          accountId: input.accountId,
        },
        include: {
          emails: {
            orderBy: { sentAt: "asc" },
            select: {
              from: true,
              to: true,
              cc: true,
              sentAt: true,
              subject: true,
              bcc: true,
              internetMessageId: true,
            },
          },
        },
      });
  
      if (!thread || thread.emails.length === 0) {
        throw new Error("Thread not found");
      }
  
      // Safely get the first email for subject fallback
      const firstEmail = thread.emails[0];
      if (!firstEmail) {
        throw new Error("No emails found in thread");
      }
  
      // Clone and reverse to find most recent email
      const reversedEmails = [...thread.emails].reverse();
      
      // Find last relevant email with proper null checks
      let lastRelevantEmail = reversedEmails.find(
        (email) => email.from.address !== account.emailAddress
      );
      
      // Fallback to last email if no external email found
      if (!lastRelevantEmail) {
        lastRelevantEmail = reversedEmails[0];
        if (!lastRelevantEmail) {
          throw new Error("No valid email found in thread");
        }
      }
  
      // Safely process recipients
      const allRecipients = [
        ...(lastRelevantEmail.to || []),
        ...(lastRelevantEmail.cc || []),
        ...(lastRelevantEmail.bcc || [])
      ];
  
      const filteredRecipients = allRecipients.filter(
        (recipient) => recipient?.address !== account.emailAddress
      );
  
      const isReplyToSelf = lastRelevantEmail.from.address === account.emailAddress;
      const replyAllTo = isReplyToSelf
        ? filteredRecipients
        : [lastRelevantEmail.from, ...filteredRecipients];
  
      // Ensure subject is properly formatted
      const subject = firstEmail.subject.startsWith('Re:') 
        ? firstEmail.subject 
        : `Re: ${firstEmail.subject || ''}`;
  
      return {
        subject,
        to: replyAllTo.filter(Boolean), // Remove any null/undefined recipients
        cc: (lastRelevantEmail.cc || []).filter(
          (cc) => cc?.address !== account.emailAddress
        ),
        from: { 
          name: account.name, 
          address: account.emailAddress 
        },
        id: lastRelevantEmail.internetMessageId,
        isReplyToSelf,
        lastMessageDate: lastRelevantEmail.sentAt,
      };
    }),

  sendEmail: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        body: z.string(),
        subject: z.string(),
        from: emailAddressSchema,
        to: z.array(emailAddressSchema),
        cc: z.array(emailAddressSchema).optional(),
        bcc: z.array(emailAddressSchema).optional(),
        replyTo: emailAddressSchema,
        inReplyTo: z.string().optional(),
        threadId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const account = await authoriseAccountAccess(
        input.accountId,
        ctx.prismaUserId!,
      );
      const acc = new Account(account.accessToken);
      // console.log("sendmail", input);
      await acc.sendEmail({
        body: input.body,
        subject: input.subject,
        threadId: input.threadId,
        to: input.to,
        bcc: input.bcc,
        cc: input.cc,
        replyTo: input.replyTo,
        from: input.from,
        inReplyTo: input.inReplyTo,
      });
    }),

  searchEmails: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        query: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const account = await authoriseAccountAccess(
        input.accountId,
        ctx.prismaUserId!,
      );
      if (!account) throw new Error("Invalid token")

      const orama = new OramaClient(account.id);
      await orama.initialise()

      const {query} = input
      const results = await orama.search({ term: query });
      return results;
    }),

    setDone: protectedProcedure.input(z.object({
      threadId: z.string().optional(),
      threadIds: z.array(z.string()).optional(),
      accountId: z.string()
  })).mutation(async ({ ctx, input }) => {
      if (!input.threadId && !input.threadIds) throw new Error("No threadId or threadIds provided")
      const account = await authoriseAccountAccess(
        input.accountId,
        ctx.prismaUserId!,
      );
      if (!account) throw new Error("Invalid token")
      if (input.threadId) {
          await ctx.db.thread.update({
              where: {
                  id: input.threadId
              },
              data: {
                  done: true
              }
          })
      }
      if (input.threadIds) {
          await ctx.db.thread.updateMany({
              where: {
                  id: {
                      in: input.threadIds
                  }
              },
              data: {
                  done: true
              }
          })
      }
  }),

  getMyAccount: protectedProcedure.input(z.object({
    accountId: z.string()
})).query(async ({ ctx, input }) => {
    const account = await authoriseAccountAccess(
        input.accountId,
        ctx.prismaUserId!,
      );
    return account
}),
getChatbotInteraction: protectedProcedure.query(async ({ ctx }) => {
    const chatbotInteraction = await ctx.db.chatbotInteraction.findUnique({
        where: {
            day: new Date().toDateString(),
            userId: ctx.auth.userId
        }, select: { count: true }
    })
    const remainingCredits = FREE_CREDITS_PER_DAY - (chatbotInteraction?.count || 0)
    return {
        remainingCredits
    }
}),
});
