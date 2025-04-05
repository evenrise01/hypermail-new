"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import useThreads from "@/hooks/use-threads";
import { atom, useAtom } from "jotai";
import { Loader2, Search, X } from "lucide-react";
import React from "react";

export const searchValueAtom = atom("");
export const isSearchingAtom = atom(false);

const SearchBar = () => {
  const [searchValue, setSearchValue] = useAtom(searchValueAtom);
  const [isSearching, setIsSearching] = useAtom(isSearchingAtom);
  const { isFetching } = useThreads();

  const handleBlur = () => {
    if (searchValue !== "") return;
    setIsSearching(false);
  };

  return (
    <motion.div 
      className="relative mx-4 my-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        {/* Glassmorphic background - adapts to theme */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-white/80 backdrop-blur-lg dark:bg-gray-800/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: isSearching ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Search icon with theme-adaptive colors */}
        <motion.div
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
          animate={{ 
            scale: isSearching ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <Search className="size-4 text-gray-600 dark:text-gray-400" />
        </motion.div>

        <Input
          placeholder={isSearching ? "Search across all dimensions..." : "Search emails..."}
          className="relative border-none bg-transparent pl-10 pr-10 text-sm backdrop-blur-sm transition-all duration-300 placeholder:text-gray-500/80 focus:ring-2 focus:ring-blue-400/30 dark:placeholder:text-gray-400/80 dark:focus:ring-blue-400/20"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsSearching(true)}
          onBlur={() => handleBlur()}
        />

        {/* Right side controls */}
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
          <AnimatePresence>
            {isFetching && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Loader2 className="size-4 animate-spin text-blue-500 dark:text-blue-400" />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {searchValue && (
              <motion.button
                className="rounded-full p-0.5 hover:bg-blue-500/10 dark:hover:bg-blue-400/10"
                onClick={() => {
                  setIsSearching(false);
                  setSearchValue("");
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="size-4 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Subtle animated border when focused - theme adaptive */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        initial={{ boxShadow: "0 0 0 0px rgba(59, 130, 246, 0)" }}
        animate={{
          boxShadow: isSearching 
            ? "0 0 0 1px rgba(59, 130, 246, 0.3)" 
            : "0 0 0 0px rgba(59, 130, 246, 0)"
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default SearchBar;