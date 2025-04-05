import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { isSearchingAtom, searchValueAtom } from "./search-bar";
import { api } from "@/trpc/react";
import { useDebounceValue } from "usehooks-ts";
import useThreads from "@/hooks/use-threads";
import DOMPurify from "dompurify";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Inbox, AlertCircle } from "lucide-react";

interface SearchDisplayProps {
  onThreadSelect: (threadId: string) => void;
}

const SearchDisplay = ({onThreadSelect}: SearchDisplayProps) => {
  const [searchValue, setSearchValue] = useAtom(searchValueAtom);
  const search = api.account.searchEmails.useMutation();
  const [debouncedSearchValue] = useDebounceValue(searchValue, 700);
  const { accountId, threadId, setThreadId } = useThreads();
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useAtom(isSearchingAtom);
  // const [showResults, setShowResults] = useState(true);
  
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
      }
    );
  }, [debouncedSearchValue, accountId]);

  const handleViewFullMessage = (threadId: string) => {
    // Set the thread to view
    setThreadId(threadId);
    // Clear the search results
    setIsSearching(false)
    // Optionally clear the search input
    setSearchValue("");
  };

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
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-h-[calc(100vh-50px)] overflow-hidden flex flex-col"
    >
      <div className="sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-black/80 p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
          <Search className="w-4 h-4" />
          <h2 className="text-sm font-medium">
            Results for <span className="text-blue-500 dark:text-blue-400">"{searchValue}"</span>
          </h2>
          {!isLoading && search.data?.hits && (
            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
              {search.data.hits.length} found
            </span>
          )}
        </div>
      </div>
      
      <div className="overflow-y-auto scrollbar-thin p-2">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-40 space-y-4"
            >
              <div className="w-8 h-8 border-2 border-t-blue-500 border-gray-200 dark:border-gray-700 rounded-full animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Searching emails...</p>
            </motion.div>
          ) : search.data?.hits.length === 0 ? (
            <motion.div 
              key="no-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center h-40 p-4 text-center"
            >
              <AlertCircle className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-gray-600 dark:text-gray-300 font-medium">No results found</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
                    transition: { delay: index * 0.05 }
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="group cursor-pointer rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm hover:shadow-md transition-all duration-200"
                  onClick={() => onThreadSelect(hit.document.threadId)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {hit.document.subject || "(No Subject)"}
                    </h3>
                    {hit.document.date && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatDate(hit.document.date)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">From:</span>
                      <span className="text-gray-700 dark:text-gray-300">{hit.document.from}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span className="font-medium">To:</span>
                      <span className="text-gray-700 dark:text-gray-300 truncate max-w-xs">
                        {hit.document.to?.join(", ") || ""}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative overflow-hidden rounded-md bg-gray-50 dark:bg-gray-800/50 p-3 mt-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="line-clamp-3">
                      {truncateText(hit.document.rawBody)}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-50 dark:from-gray-800/50 to-transparent"></div>
                  </div>
                  
                  {/* <div className="flex justify-end mt-2">
                    <button 
                      onClick={() => handleViewFullMessage(hit.document.threadId)}
                      className="text-xs text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      View full message →
                    </button>
                  </div> */}
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