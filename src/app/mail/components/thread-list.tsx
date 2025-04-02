"use client";

import DOMPurify from "dompurify";
import useThreads from "@/hooks/use-threads";
import React, { type ComponentProps, useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const ThreadList = () => {
  const { threads, threadId, setThreadId, isLoading, isFetching } = useThreads();
  // Track if we've loaded threads at least once
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Update hasLoadedOnce when threads are first loaded
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

  // Only show skeleton on initial load, not during refetches
  if (isLoading && !hasLoadedOnce) {
    return (
      <div className="h-full w-full overflow-y-auto bg-gradient-to-br from-[#1D2B64]/5 to-[#F8CDDA]/5 dark:from-[#1D2B64]/10 dark:to-[#F8CDDA]/10">
        <div className="flex flex-col gap-2 p-4 pt-0">
          <div className="mt-5 first:mt-0">
            <Skeleton className="h-6 w-24 rounded" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className="rounded-lg border border-gray-200 dark:border-gray-700 p-3"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-11/12" />
                <div className="flex gap-2 mt-1">
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            </div>
          ))}
          <div className="mt-5">
            <Skeleton className="h-6 w-24 rounded" />
          </div>
          {[1, 2, 3].map((i) => (
            <div 
              key={`second-${i}`} 
              className="rounded-lg border border-gray-200 dark:border-gray-700 p-3"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-gradient-to-br from-[#1D2B64]/5 to-[#F8CDDA]/5 dark:from-[#1D2B64]/10 dark:to-[#F8CDDA]/10">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {/* Optional loading indicator for subsequent fetches */}
        {/* {isFetching && hasLoadedOnce && (
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-1 text-xs text-center text-gray-500 dark:text-gray-400 rounded-md animate-pulse">
            Refreshing...
          </div>
        )} */}
        
        {Object.entries(groupedThreads ?? {}).map(([date, threads]) => {
          return (
            <React.Fragment key={date}>
              <div className="dark:text-muted-foreground mt-5 text-xs font-medium first:mt-0 bg-gradient-to-r from-[#1D2B64]/80 to-[#F8CDDA]/80 text-white dark:from-[#1D2B64] dark:to-[#F8CDDA] py-1 px-2 rounded inline-block">
                {date}
              </div>
              {threads.map((thread) => {
                const isSelected = thread.id === threadId;
                return (
                  <button
                    onClick={() => setThreadId(thread.id)}
                    key={thread.id}
                    className={cn(
                      "relative flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:shadow-md",
                      "border-gray-200 dark:border-gray-700",
                      "hover:border-[#F8CDDA]/50 dark:hover:border-[#F8CDDA]/30",
                      {
                        'bg-gradient-to-r from-[#1D2B64]/10 to-[#F8CDDA]/10 dark:from-[#1D2B64]/20 dark:to-[#F8CDDA]/20 border-[#F8CDDA]/60 dark:border-[#F8CDDA]/40 shadow-sm': isSelected,
                        'bg-white dark:bg-gray-800/80': !isSelected
                      },
                      "focus:outline-none focus:ring-2 focus:ring-[#F8CDDA]/50 dark:focus:ring-[#F8CDDA]/30"
                    )}
                  >
                    <div className="flex w-full flex-col gap-2">
                      <div className="flex items-center">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "font-semibold",
                            isSelected ? "text-[#1D2B64] dark:text-white" : ""
                          )}>
                            {thread.emails.at(-1)!.from.name}
                          </div>
                        </div>
                        <div className={cn(
                          "ml-auto text-xs",
                          isSelected ? "text-[#1D2B64]/80 dark:text-white/80" : "text-gray-500 dark:text-gray-400"
                        )}>
                          {formatDistanceToNow(
                            thread.emails.at(-1)?.sentAt ?? new Date(),
                            { addSuffix: true },
                          )}
                        </div>
                      </div>
                      <div className={cn(
                        "text-xs font-medium",
                        isSelected ? "text-[#1D2B64] dark:text-white" : ""
                      )}>
                        {thread.subject}
                      </div>
                    </div>
                    {/* DangerouslySetInnerHTML exposes the client to vulnerability, to mitigate we are going to use dompurify library */}
                    <div
                      className={cn(
                        "text-xs text-muted-foreground line-clamp-2",
                        isSelected ? "text-[#1D2B64]/70 dark:text-white/70" : "text-gray-500 dark:text-gray-400"
                      )}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          thread.emails.at(-1)?.bodySnippet ?? "",
                          { USE_PROFILES: { html: true } },
                        ),
                      }}
                    ></div>
                    {thread.emails[0]?.sysLabels.length! > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        {thread.emails[0]?.sysLabels.map(label => {
                          return (
                            <Badge 
                              key={label} 
                              variant={getBadgeVariantFromLabel(label)}
                              className={cn(
                                getBadgeVariantFromLabel(label) === 'default' 
                                  ? "bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] border-none text-white"
                                  : "bg-gradient-to-r from-[#1D2B64]/20 to-[#F8CDDA]/20 dark:from-[#1D2B64]/40 dark:to-[#F8CDDA]/40 text-[#1D2B64] dark:text-white border-none"
                              )}
                            >
                              {label}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                    {/* Subtle active indicator */}
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#1D2B64] to-[#F8CDDA] rounded-l-lg"></div>
                    )}
                  </button>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

function getBadgeVariantFromLabel(label: string): ComponentProps<typeof Badge>['variant'] {
  if (['work'].includes(label.toLowerCase())) {
    return 'default';
  }
  return 'secondary';
}

export default ThreadList;