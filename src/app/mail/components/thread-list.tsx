"use client";

import DOMPurify from "dompurify";
import useThreads from "@/hooks/use-threads";
import React, { type ComponentProps, useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Inbox, Star, Tag, AlertCircle, Trash2, Archive } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";

const ThreadList = () => {
  const { threads, threadId, setThreadId, isLoading, isFetching } =
    useThreads();
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [tab] = useLocalStorage<
    "inbox" | "drafts" | "sent" | "archive" | "trash" | "star"
  >("hypermail-tab", "inbox");

  useEffect(() => {
    if (threads && threads.length > 0 && !hasLoadedOnce) {
      setHasLoadedOnce(true);
    }
  }, [threads, hasLoadedOnce]);

  const groupedThreads = threads?.reduce(
    (acc, thread) => {
      const date = format(thread.emails[0]?.sentAt ?? new Date(), "yyyy-MM-dd");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date]!.push(thread);
      return acc;
    },
    {} as Record<string, typeof threads>,
  );

  const renderLabelIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "important":
        return <AlertCircle className="h-3 w-3" />;
      case "work":
        return <Tag className="h-3 w-3" />;
      case "personal":
        return <Star className="h-3 w-3" />;
      default:
        return <Inbox className="h-3 w-3" />;
    }
  };
  // Helper function to check if a thread has unread emails
  const isThreadUnread = (thread: any) => {
    if (tab === "sent") return false; // Sent emails are never "unread"
    return thread.emails.some((email: any) =>
      email.sysLabels.some((label: string) => label.toLowerCase() === "unread"),
    );
  };

  // Loading skeleton for initial load
  if (isLoading && !hasLoadedOnce) {
    return (
      <div className="h-full w-full overflow-y-auto bg-gradient-to-br from-blue-950/5 to-purple-300/5 dark:from-blue-950/10 dark:to-purple-300/10">
        <div className="flex min-h-full flex-col gap-3 p-5 pt-1">
          <div className="mt-5 first:mt-0">
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-100 bg-white/80 p-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/30"
            >
              <div className="flex h-full flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32 rounded-full" />
                  <Skeleton className="h-3 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-4/5 rounded-full" />
                <Skeleton className="h-3 w-full rounded-full" />
                <Skeleton className="h-3 w-11/12 rounded-full" />
                <div className="mt-1 flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }


  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-gradient-to-br from-blue-950/5 to-purple-300/5 dark:from-blue-950/10 dark:to-purple-300/10">
      <AnimatePresence>
        {isFetching && hasLoadedOnce && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sticky top-2 z-10 mx-auto w-32 rounded-full border border-gray-100 bg-white/80 p-1 text-center text-xs text-gray-500 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-400"
          >
            Syncing emails...
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex h-full flex-1 flex-col gap-3 p-5 pt-1">
        {Object.entries(groupedThreads ?? {}).map(([date, threads]) => {
          return (
            <React.Fragment key={date}>
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-5 inline-block rounded-full bg-gradient-to-r from-blue-900 to-purple-400 px-4 py-1.5 text-xs font-medium text-white shadow-sm first:mt-0 dark:from-blue-800 dark:to-purple-500"
              >
                {format(new Date(date), "EEEE, MMMM d")}
              </motion.div>
              {threads.map((thread, idx) => {
                const isSelected = thread.id === threadId;
                const latestEmail = thread.emails.at(-1)!;
                const hasUnreadEmails = isThreadUnread(thread);

                return (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setThreadId(thread.id)}
                    key={thread.id}
                    className={cn(
                      "relative flex flex-col items-start gap-2 rounded-xl p-4 text-left text-sm transition-all",
                      "border backdrop-blur-sm",
                      {
                        "border-transparent bg-white/90 shadow-lg shadow-blue-900/5 dark:bg-gray-900/50 dark:shadow-purple-300/5":
                          isSelected,
                        "border-gray-100 bg-white/70 hover:border-purple-200/50 dark:border-gray-800 dark:bg-gray-900/30 dark:hover:border-purple-500/30":
                          !isSelected,
                      },
                      "focus:ring-2 focus:ring-purple-300/50 focus:outline-none dark:focus:ring-purple-500/30",
                    )}
                  >
                    <div className="flex w-full flex-col gap-2">
                      <div className="flex items-center">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              hasUnreadEmails ? "font-semibold" : "font-medium",
                              isSelected
                                ? "text-blue-900 dark:text-purple-200"
                                : "",
                            )}
                          >
                            {latestEmail.from.name}
                          </div>
                        </div>
                        <div
                          className={cn(
                            "ml-auto text-xs",
                            isSelected
                              ? "text-blue-900/80 dark:text-purple-200/80"
                              : "text-gray-500 dark:text-gray-400",
                          )}
                        >
                          {formatDistanceToNow(
                            latestEmail.sentAt ?? new Date(),
                            { addSuffix: true },
                          )}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "line-clamp-1 text-xs font-medium",
                          hasUnreadEmails ? "font-semibold" : "",
                          isSelected ? "text-blue-900 dark:text-white" : "",
                        )}
                      >
                        {thread.subject}
                      </div>
                    </div>
                    <div
                      className={cn(
                        "line-clamp-2 text-xs",
                        isSelected
                          ? "text-blue-900/70 dark:text-white/80"
                          : "text-gray-500 dark:text-gray-400",
                      )}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          latestEmail?.bodySnippet ?? "",
                          { USE_PROFILES: { html: true } },
                        ),
                      }}
                    ></div>
                    {thread.emails[0]?.sysLabels.length! > 0 && (
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        {thread.emails[0]?.sysLabels
                          .filter(
                            (label: string) => label.toLowerCase() !== "unread",
                          )
                          .map((label: string) => {
                            return (
                              <Badge
                                key={label}
                                variant={getBadgeVariantFromLabel(label)}
                                className={cn(
                                  "flex items-center gap-1 transition-all",
                                  getBadgeVariantFromLabel(label) === "default"
                                    ? "border-none bg-gradient-to-r from-blue-900 to-purple-400 text-white hover:shadow-md"
                                    : "border-none bg-gradient-to-r from-blue-900/10 to-purple-400/10 text-blue-900 dark:from-blue-900/20 dark:to-purple-400/20 dark:text-purple-200",
                                )}
                              >
                                {renderLabelIcon(label)}
                                <span>{label}</span>
                              </Badge>
                            );
                          })}
                      </div>
                    )}

                    {/* Active indicator line */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeThread"
                        className="absolute top-0 bottom-0 left-0 w-1 rounded-l-xl bg-gradient-to-b from-blue-900 to-purple-400"
                      />
                    )}

                    {/* Unread indicator dot */}
                    {hasUnreadEmails && (
                      <div className="absolute right-3 bottom-3 h-2 w-2 rounded-full bg-blue-600 dark:bg-purple-400"></div>
                    )}
                  </motion.button>
                );
              })}
            </React.Fragment>
          );
        })}
        
        {groupedThreads && Object.keys(groupedThreads).length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-64 flex-col items-center justify-center text-gray-500 dark:text-gray-400"
          >
            {tab === "trash" ? (
              <Trash2 className="mb-2 h-12 w-12 opacity-50" />
            ) : tab === "archive" ? (
              <Archive className="mb-2 h-12 w-12 opacity-50" />
            ) : tab === "star" ? (
              <Star className="mb-2 h-12 w-12 opacity-50" />
            ) : (
              <Inbox className="mb-2 h-12 w-12 opacity-50" />
            )}
            <p className="text-sm">
              {tab === "trash"
                ? "Trash is empty"
                : tab === "archive"
                  ? "Archive is empty"
                  : tab === "star"
                    ? "No starred threads"
                    : "Your inbox is empty"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

function getBadgeVariantFromLabel(
  label: string,
): ComponentProps<typeof Badge>["variant"] {
  if (["work", "important"].includes(label.toLowerCase())) {
    return "default";
  }
  return "secondary";
}

export default ThreadList;
