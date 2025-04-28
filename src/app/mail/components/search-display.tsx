import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { isSearchingAtom, searchValueAtom } from "./search-bar";
import { api } from "@/trpc/react";
import { useDebounceValue } from "usehooks-ts";
import useThreads from "@/hooks/use-threads";
import DOMPurify from "dompurify";
import { motion, AnimatePresence } from "framer-motion";
import { Search, AlertCircle } from "lucide-react";

interface SearchDisplayProps {
  onThreadSelect: (threadId: string) => void;
}

const SearchDisplay = ({ onThreadSelect }: SearchDisplayProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchValue, setSearchValue] = useAtom(searchValueAtom);
  const search = api.account.searchEmails.useMutation();
  const [debouncedSearchValue] = useDebounceValue(searchValue, 700);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { accountId, setThreadId } = useThreads();
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSearching, setIsSearching] = useAtom(isSearchingAtom);

  // Debounce the search value to reduce backend endpoint calls
  useEffect(() => {
    if (!accountId) return;

    setIsLoading(true);
    search.mutate(
      {
        accountId,
        query: debouncedSearchValue,
      },
      {
        onSettled: () => setIsLoading(false),
      },
    );
  }, [debouncedSearchValue, accountId]);

  // const handleViewFullMessage = (threadId: string) => {
  //   // Set the thread to view
  //   setThreadId(threadId);
  //   // Clear the search results
  //   setIsSearching(false)
  //   // Optionally clear the search input
  //   setSearchValue("");
  // };

  // Create a truncated version of text for preview
  const truncateText = (text: string | Node, maxLength = 150) => {
    if (!text) return "";
    const sanitized = DOMPurify.sanitize(text, {
      USE_PROFILES: { html: false },
      ALLOWED_TAGS: [],
    }).trim();

    if (sanitized.length <= maxLength) return sanitized;
    return `${sanitized.substring(0, maxLength)}...`;
  };

  // Format date to be more readable
  const formatDate = (dateString: string | number | Date) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex max-h-[calc(100vh-50px)] flex-col overflow-hidden"
    >
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 p-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/90">
        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
          <Search className="h-4 w-4" />
          <h2 className="text-sm font-medium">
            Results for{" "}
            <span className="text-blue-600 dark:text-blue-400">
              &quot;{searchValue}&quot;
            </span>
          </h2>
          {!isLoading && search.data?.hits && (
            <span className="rounded-full bg-gray-200 px-2 py-1 text-xs dark:bg-gray-800">
              {search.data.hits.length} found
            </span>
          )}
        </div>
      </div>

      <div className="scrollbar-thin overflow-y-auto p-2">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-40 flex-col items-center justify-center space-y-4"
            >
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600 dark:border-gray-700" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Searching emails...
              </p>
            </motion.div>
          ) : search.data?.hits.length === 0 ? (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-40 flex-col items-center justify-center p-4 text-center"
            >
              <AlertCircle className="mb-2 h-8 w-8 text-gray-500 dark:text-gray-400" />
              <p className="font-medium text-gray-700 dark:text-gray-200">
                No results found
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Try adjusting your search terms
              </p>
            </motion.div>
          ) : (
            <motion.ul
              key="results"
              className="space-y-2 py-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {search.data?.hits.map((hit, index) => (
                <motion.li
                  key={hit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.05 },
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="group cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                  onClick={() => onThreadSelect(hit.document.threadId)}
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-base font-medium text-gray-900 transition-colors duration-200 group-hover:text-blue-700 dark:text-gray-100 dark:group-hover:text-blue-400">
                      {hit.document.subject || "(No Subject)"}
                    </h3>
                    {hit.document.date && (
                      <span className="text-xs whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {formatDate(hit.document.date)}
                      </span>
                    )}
                  </div>

                  <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">From:</span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {hit.document.from}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="font-medium">To:</span>
                      <span className="max-w-xs truncate text-gray-800 dark:text-gray-200">
                        {hit.document.to?.join(", ") || ""}
                      </span>
                    </div>
                  </div>

                  <div className="relative mt-2 overflow-hidden rounded-md bg-gray-100 p-3 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                    <div className="line-clamp-3">
                      {truncateText(hit.document.rawBody)}
                    </div>
                    <div className="absolute right-0 bottom-0 left-0 h-6 bg-gradient-to-t from-gray-100 to-transparent dark:from-gray-800"></div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SearchDisplay;
