// server/api/routers/threadActions.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { authoriseAccountAccess } from "./account";
import type { Prisma } from "@prisma/client";

export const threadActionsRouter = createTRPCRouter({
    archiveThread: protectedProcedure
    .input(z.object({
      threadId: z.string().optional(),
      threadIds: z.array(z.string()).optional(),
      accountId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      if (!input.threadId && !input.threadIds) {
        throw new Error("No threadId or threadIds provided");
      }

      const account = await authoriseAccountAccess(
        input.accountId,
        ctx.prismaUserId!
      );
      if (!account) throw new Error("Invalid token");

      const updateData = {
        isArchived: true,
        inboxStatus: false // Remove from inbox
      };

      if (input.threadId) {
        await ctx.db.thread.update({
          where: { id: input.threadId },
          data: updateData
        });
      } else if (input.threadIds) {
        await ctx.db.thread.updateMany({
          where: { id: { in: input.threadIds } },
          data: updateData
        });
      }
    }),


    markAsReadThread: protectedProcedure
    .input(z.object({
      threadId: z.string().optional(),
      threadIds: z.array(z.string()).optional(),
      accountId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      if (!input.threadId && !input.threadIds) {
        throw new Error("No threadId or threadIds provided");
      }

      const account = await authoriseAccountAccess(
        input.accountId,
        ctx.prismaUserId!
      );
      if (!account) throw new Error("Invalid token");

      const updateData = {
        isRead: true
      };

      if (input.threadId) {
        await ctx.db.thread.update({
          where: { id: input.threadId },
          data: updateData
        });
      } else if (input.threadIds) {
        await ctx.db.thread.updateMany({
          where: { id: { in: input.threadIds } },
          data: updateData
        });
      }
    }),

    markAsUnreadThread: protectedProcedure
    .input(z.object({
      threadId: z.string().optional(),
      threadIds: z.array(z.string()).optional(),
      accountId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      if (!input.threadId && !input.threadIds) {
        throw new Error("No threadId or threadIds provided");
      }

      const account = await authoriseAccountAccess(
        input.accountId,
        ctx.prismaUserId!
      );
      if (!account) throw new Error("Invalid token");

      const updateData = {
        isRead: false
      };

      if (input.threadId) {
        await ctx.db.thread.update({
          where: { id: input.threadId },
          data: updateData
        });
      } else if (input.threadIds) {
        await ctx.db.thread.updateMany({
          where: { id: { in: input.threadIds } },
          data: updateData
        });
      }
    }),

  trashThread: protectedProcedure
    .input(z.object({
      threadId: z.string().optional(),
      threadIds: z.array(z.string()).optional(),
      accountId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      if (!input.threadId && !input.threadIds) {
        throw new Error("No threadId or threadIds provided");
      }

      const account = await authoriseAccountAccess(
        input.accountId,
        ctx.prismaUserId!
      );
      if (!account) throw new Error("Invalid token");

      const updateData = {
        isTrashed: true,
        inboxStatus: false // Remove from inbox
      };

      if (input.threadId) {
        await ctx.db.thread.update({
          where: { id: input.threadId },
          data: updateData
        });
      } else if (input.threadIds) {
        await ctx.db.thread.updateMany({
          where: { id: { in: input.threadIds } },
          data: updateData
        });
      }
    }),

    starThread: protectedProcedure
    .input(z.object({
      threadId: z.string().optional(),
      threadIds: z.array(z.string()).optional(),
      accountId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      if (!input.threadId && !input.threadIds) {
        throw new Error("No threadId or threadIds provided");
      }

      const account = await authoriseAccountAccess(
        input.accountId,
        ctx.prismaUserId!
      );
      if (!account) throw new Error("Invalid token");

      const updateData = {
        isStarred: true,
      };

      if (input.threadId) {
        await ctx.db.thread.update({
          where: { id: input.threadId },
          data: updateData
        });
      } else if (input.threadIds) {
        await ctx.db.thread.updateMany({
          where: { id: { in: input.threadIds } },
          data: updateData
        });
      }
    }),

    spamThread: protectedProcedure
  .input(z.object({
    threadId: z.string().optional(),
    threadIds: z.array(z.string()).optional(),
    accountId: z.string()
  }))
  .mutation(async ({ ctx, input }) => {
    if (!input.threadId && !input.threadIds) {
      throw new Error("No threadId or threadIds provided");
    }

    const account = await authoriseAccountAccess(
      input.accountId,
      ctx.prismaUserId!
    );
    if (!account) throw new Error("Invalid token");

    const updateData = {
      isSpam: true,
      inboxStatus: false,
      isArchived: false,
      isStarred: false,
    };

    try {
      if (input.threadId) {
        // For single thread update
        await ctx.db.thread.update({
          where: { 
            id: input.threadId,
            accountId: input.accountId // Security check
          },
          data: {
            ...updateData,
            emails: {
              updateMany: {
                where: {},
                data: {
                  sysLabels: {
                    push: "junk"
                  }
                }
              }
            }
          }
        });
      } else if (input.threadIds) {
        // For bulk update
        await ctx.db.thread.updateMany({
          where: { 
            id: { in: input.threadIds },
            accountId: input.accountId // Security check
          },
          data: updateData
        });
        
        // Update emails separately for bulk operation
        await ctx.db.email.updateMany({
          where: {
            threadId: { in: input.threadIds },
          },
          data: {
            sysLabels: {
              push: "junk"
            }
          }
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Failed to mark as spam:", error);
      throw new Error("Failed to mark thread(s) as spam");
    }
  }),



  // Add this to get counts for sidebar
  getThreadCounts: protectedProcedure
  .input(
    z.object({
      accountId: z.string(),
      tab: z.enum(["inbox", "sent", "drafts", "archive", "trash", "star", "spam"]).optional(),
    }),
  )
  .query(async ({ ctx, input }) => {
    const account = await authoriseAccountAccess(
      input.accountId,
      ctx.prismaUserId!
    );
    if (!account) throw new Error("Invalid token");

    // Base filter for all counts
    const baseFilter = { accountId: input.accountId };

    // If a specific tab is requested, return only that count
    if (input.tab) {
      const filter: Prisma.ThreadWhereInput = { ...baseFilter };

      switch (input.tab) {
        case "inbox":
          filter.inboxStatus = true;
          filter.isTrashed = false;
          filter.isSpam = false;
          break;
        case "sent":
          filter.sentStatus = true;
          break;
        case "drafts":
          filter.draftStatus = true;
          break;
        case "archive":
          filter.isArchived = true;
          filter.isTrashed = false;
          filter.isSpam = false;
          break;
        case "trash":
          filter.isTrashed = true;
          break;
        case "star":
          filter.isStarred = true;
          break;
        case "spam":
          // Either use the isSpam flag or check for "junk" in sysLabels
          filter.isSpam = true;
          break;
      }

      return {
        count: await ctx.db.thread.count({ where: filter }),
        tab: input.tab
      };
    }

    // If no tab specified, return all counts
    const [inbox, archived, trashed, sent, drafts, starred, spammed] = await Promise.all([
      // Inbox count (excludes spam and trash)
      ctx.db.thread.count({
        where: { 
          ...baseFilter,
          inboxStatus: true,
          isTrashed: false,
          isSpam: false,
        }
      }),
      // Archive count
      ctx.db.thread.count({
        where: { 
          ...baseFilter,
          isArchived: true,
          isTrashed: false,
          isSpam: false
        }
      }),
      // Trash count
      ctx.db.thread.count({
        where: { 
          ...baseFilter,
          isTrashed: true
        }
      }),
      // Sent count
      ctx.db.thread.count({
        where: { 
          ...baseFilter,
          sentStatus: true
        }
      }),
      // Drafts count
      ctx.db.thread.count({
        where: { 
          ...baseFilter,
          draftStatus: true
        }
      }),
      // Starred count
      ctx.db.thread.count({
        where: { 
          ...baseFilter,
          isStarred: true
        }
      }),
      // Spam count
      ctx.db.thread.count({
        where: { 
          ...baseFilter,
          isSpam: true
        }
      }),
    ]);

    console.log("Spammed: ", spammed)
    return { 
      inbox,
      archived, 
      trashed,
      sent,
      drafts,
      starred,
      spammed
    };
  }),
});