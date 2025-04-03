import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "@/server/db";
import type { Prisma } from "@prisma/client";
import { emailAddressSchema } from "@/lib/types";
import { Account } from "@/lib/account";
import { access } from "fs/promises";

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
  if (!account) throw new Error("Account not found");
  return account;
};

const inboxFilter = (accountId: string): Prisma.ThreadWhereInput => ({
  accountId,
  inboxStatus: true,
});

const sentFilter = (accountId: string): Prisma.ThreadWhereInput => ({
  accountId,
  sentStatus: true,
});

const draftFilter = (accountId: string): Prisma.ThreadWhereInput => ({
  accountId,
  draftStatus: true,
  inboxStatus: false, // Ensuring exclusivity
  sentStatus: false,
});

export const accountRouter = createTRPCRouter({
  getAccounts: protectedProcedure.query(async ({ ctx }) => {
    // console.log("Current userId:", ctx.auth.userId);
    // console.log("Current user prismaId:", ctx.prismaUserId);
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
      //Sync emails
      const acc = new Account(account.accessToken)
      await acc.syncEmails().catch(console.error)

      
      let filter: Prisma.ThreadWhereInput = {};
      if (input.tab === "inbox") {
        filter = inboxFilter(account.id);
      } else if (input.tab === "sent") {
        filter = sentFilter(account.id);
      } else if (input.tab === "drafts" || input.tab === "draft") {
        // Handle both variations
        filter = draftFilter(account.id);
      }

      filter.done = {
        equals: input.done,
      };

      return await ctx.db.thread.findMany({
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
    
    getReplyDetails: protectedProcedure.input(z.object({
      accountId: z.string(),
      threadId: z.string()
    })).query(async({ctx, input}) => {
      const account = await authoriseAccountAccess(
        input.accountId,
        ctx.prismaUserId!,
      );
      const thread = await ctx.db.thread.findFirst({
        where: {
          id: input.threadId
        },
        include: {
          emails: {
            orderBy: {sentAt: 'asc'},
            select: {
              from:true,
              to:true,
              cc:true,
              sentAt:true,
              subject: true,
              bcc: true,
              internetMessageId: true, //required to send to Aurinko in order to send the email in response to the thread
            }
          }
        }
      })
      if(!thread || thread.emails.length === 0) throw new Error('Thread not found')

      //Find the last email that doesn't belong to the user itself
      const lastExternalEmail = thread.emails.reverse().find(email => email.from.address !==account.emailAddress)

      if(!lastExternalEmail) throw new Error('No external email found')

      return {
        subject: lastExternalEmail.subject,
        to: [lastExternalEmail.from, ...lastExternalEmail.to.filter(to => to.address !==account.emailAddress)],
        cc: lastExternalEmail.cc.filter(cc => cc.address !== account.emailAddress),
        from: {name: account.name, address: account.emailAddress},
        id: lastExternalEmail.internetMessageId
      }
    }),

    sendEmail: protectedProcedure.input(z.object({
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
  })).mutation(async ({ ctx, input }) => {
      const account = await authoriseAccountAccess(input.accountId, ctx.prismaUserId!)
      const acc = new Account(account.accessToken)
      console.log('sendmail', input)
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
      })
  }),
});
