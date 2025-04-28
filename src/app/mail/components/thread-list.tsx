"use client";

import DOMPurify from "dompurify";
import useThreads from "@/hooks/use-threads";
import React, { type ComponentProps, useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Inbox, Star, Tag, AlertCircle, Trash2, Archive } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { useThreadActions } from "@/hooks/use-thread-actions";
import { toast } from "sonner";

const ThreadList = () => {
  const { threads, threadId, setThreadId, isLoading, isFetching, accountId } =
    useThreads();
  const { markAsReadThread } = useThreadActions();
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [tab] = useLocalStorage<
    | "inbox"
    | "drafts"
    | "sent"
    | "archive"
    | "trash"
    | "star"
    | "spam"
    | "unread"
  >("hypermail-tab", "inbox");
  const [selectedThreads, setSelectedThreads] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (threads && threads.length > 0 && !hasLoadedOnce) {
      setHasLoadedOnce(true);
    }
  }, [threads, hasLoadedOnce]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedThreads(new Set());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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


// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isThreadUnread = (thread: any) => {
    if (tab === "sent") return false;
    return !thread.isRead;
  };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleThreadClick = (thread: any, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === "INPUT") return;

    if (selectedThreads.size > 0) {
      const newSelection = new Set(selectedThreads);
      newSelection.has(thread.id)
        ? newSelection.delete(thread.id)
        : newSelection.add(thread.id);
      setSelectedThreads(newSelection);
      return;
    }

    setThreadId(thread.id);
    if (!thread.isRead) {
      markAsReadThread(thread.id, accountId);
    }
  };

  const handleBulkMarkAsRead = async () => {
    if (selectedThreads.size === 0) return;

    try {
      await Promise.all(
        Array.from(selectedThreads).map((threadId) =>
          markAsReadThread(threadId, accountId),
        ),
      );
      toast.success(
        `${selectedThreads.size} ${selectedThreads.size === 1 ? "thread" : "threads"} marked as read`,
      );
      setSelectedThreads(new Set());
    } catch (error) {
      toast.error("Failed to mark threads as read");
      console.error(error)
    }
  };

  // Loading skeleton remains the same...
  if (isLoading && !hasLoadedOnce) {
    return (
      <div className="h-full w-full overflow-y-auto bg-gradient-to-br from-blue-950/5 to-purple-300/5 dark:from-blue-950/10 dark:to-purple-300/10">
        {/* ... existing skeleton code ... */}
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

      {/* Bulk Actions Toolbar */}
      <AnimatePresence>
        {selectedThreads.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sticky top-2 z-10 mx-auto mb-4 flex w-full max-w-md items-center justify-between rounded-lg border border-gray-200 bg-white/90 p-3 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/90"
          >
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {selectedThreads.size} selected
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBulkMarkAsRead}
                className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
              >
                Mark as Read
              </button>
              <button
                onClick={() => setSelectedThreads(new Set())}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
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
                    whileHover={{ scale: selectedThreads.size > 0 ? 1 : 1.01 }}
                    whileTap={{ scale: selectedThreads.size > 0 ? 1 : 0.99 }}
                    onClick={(e) => handleThreadClick(thread, e)}
                    key={thread.id}
                    className={cn(
                      "relative flex flex-col items-start gap-2 rounded-xl p-4 pl-10 text-left text-sm transition-all",
                      "border backdrop-blur-sm",
                      {
                        "border-transparent bg-white/90 shadow-lg shadow-blue-900/5 dark:bg-gray-900/50 dark:shadow-purple-300/5":
                          isSelected,
                        "border-gray-100 bg-white/70 hover:border-purple-200/50 dark:border-gray-800 dark:bg-gray-900/30 dark:hover:border-purple-500/30":
                          !isSelected && !selectedThreads.has(thread.id),
                        "border-blue-500 bg-blue-50/50 dark:border-blue-400 dark:bg-blue-900/20":
                          selectedThreads.has(thread.id),
                      },
                      "focus:ring-2 focus:ring-purple-300/50 focus:outline-none dark:focus:ring-purple-500/30",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selectedThreads.has(thread.id)}
                      onChange={(e) => {
                        const newSelection = new Set(selectedThreads);
                        e.target.checked
                          ? newSelection.add(thread.id)
                          : newSelection.delete(thread.id);
                        setSelectedThreads(newSelection);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-4 left-4 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex w-full flex-col gap-2">
                      <div className="flex items-center">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              hasUnreadEmails ? "font-semibold" : "font-medium",
                              isSelected
                                ? "text-blue-900 dark:text-purple-200"
                                : "",
                              selectedThreads.has(thread.id)
                                ? "text-blue-900 dark:text-blue-200"
                                : "",
                            )}
                          >
                            {latestEmail.from.name}
                          </div>
                          {hasUnreadEmails && (
                            <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-purple-400"></div>
                          )}
                        </div>
                        <div
                          className={cn(
                            "ml-auto text-xs",
                            isSelected
                              ? "text-blue-900/80 dark:text-purple-200/80"
                              : "text-gray-500 dark:text-gray-400",
                            selectedThreads.has(thread.id)
                              ? "text-blue-900/80 dark:text-blue-200/80"
                              : "",
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
                          selectedThreads.has(thread.id)
                            ? "text-blue-900 dark:text-blue-200"
                            : "",
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
                        selectedThreads.has(thread.id)
                          ? "text-blue-900/70 dark:text-blue-200/80"
                          : "",
                      )}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          latestEmail?.bodySnippet ?? "",
                          { USE_PROFILES: { html: true } },
                        ),
                      }}
                    ></div>
                    {isSelected && (
                      <motion.div
                        layoutId="activeThread"
                        className="absolute top-0 bottom-0 left-0 w-1 rounded-l-xl bg-gradient-to-b from-blue-900 to-purple-400"
                      />
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


export default ThreadList;
