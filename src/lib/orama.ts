import { db } from "@/server/db";
import { type AnyOrama, create, insert, search } from "@orama/orama";
import { persist, restore } from "@orama/plugin-data-persistence";

export class OramaClient {
  //@ts-ignore
  private orama: AnyOrama;
  private accountId: string;

  constructor(accountId: string) {
    this.accountId = accountId;
  }

  /**
   * Gets the total number of documents indexed in Orama
   * @returns Promise<number> - The count of documents
   */
  async getDocumentCount(): Promise<number> {
    if (!this.orama) {
      throw new Error('Orama instance not initialized');
    }

    try {
      // Perform an empty search to get total count
      const result = await search(this.orama, {
        term: '',
        limit: 1, // We only need the count, not the actual results
      });
      
      return result.count;
    } catch (error) {
      console.error('Failed to get document count:', error);
      throw new Error('Could not retrieve document count');
    }
  }
  
  async saveIndex() {
    const index = await persist(this.orama, "json");
    await db.account.update({
      where: {
        id: this.accountId,
      },
      data: {
        oramaIndex: index,
      },
    });
  }

  async initialise() {
    const account = await db.account.findUnique({
      where: {
        id: this.accountId,
      },
    });
    if (!account) {
      throw new Error("Account not found!");
    }

    if (account.oramaIndex) {
      this.orama = await restore("json", account.oramaIndex as any);
    } else {
      this.orama = await create({
        schema: {
          title: "string",
          body: "string",
          rawBody: "string",
          from: "string",
          to: "string[]",
          sentAt: "string",
          threadId: "string",
        },
      });
      await this.saveIndex();
    }
  }

  async search({ term }: { term: string }) {
    return await search(this.orama, {
      term,
    });
    
  }

  async insert(document: any) {
    await insert(this.orama, document);
    await this.saveIndex();

    // console.log("Saving document: ", document)
    // console.log("Saving index: ", this.saveIndex)
  }
}