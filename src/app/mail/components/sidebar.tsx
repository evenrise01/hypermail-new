"use client";
import React, { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Nav } from "./nav";
import { File, Inbox, Send } from "lucide-react";
import { api } from "@/trpc/react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

type Props = {
  isCollapsed: boolean;
};

const Sidebar = ({ isCollapsed }: Props) => {
  const { theme } = useTheme();
  const [accountId, setAccountId] = useLocalStorage("accountId", "");
  const [tab] = useLocalStorage<"inbox" | "drafts" | "sent">(
    "hypermail-tab",
    "inbox",
  );

  // Add debug query to find which account has threads
  const { data: threadAccounts } = api.account.findThreadAccounts.useQuery();

  // Get counts for the currently selected account
  const { data: inboxThreads } = api.account.getNumThreads.useQuery({
    accountId,
    tab: "inbox",
  }, { enabled: !!accountId });
  
  const { data: draftThreads } = api.account.getNumThreads.useQuery({
    accountId,
    tab: "drafts",
  }, { enabled: !!accountId });
  
  const { data: sentThreads } = api.account.getNumThreads.useQuery({
    accountId,
    tab: "sent", 
  }, { enabled: !!accountId });

  // Automatically set accountId to an account that has threads (if we found one and none is selected)
  useEffect(() => {
    if (threadAccounts && (!accountId)) {
      const accountsWithThreads = Object.keys(threadAccounts.threadsByAccount);
      if (accountsWithThreads.length > 0) {
        const firstAccountWithThreads = accountsWithThreads[0];
        console.log(`Automatically selecting account ${firstAccountWithThreads} which has threads`);
        setAccountId(firstAccountWithThreads!);
      }
    }
  }, [threadAccounts, accountId, setAccountId]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        h-full relative
        ${isCollapsed ? "w-16" : "w-64"}
        transition-all duration-300 ease-in-out
        border-r dark:border-gray-800
      `}
    >
      <div className={`
        absolute top-0 left-0 right-0 h-full z-0 opacity-70
        dark:opacity-25 bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA]
        rounded-br-3xl
      `} />
      
      <div className="relative z-10 p-2 h-full">
        <div className={`
          py-4 px-2 mb-6 rounded-lg
          ${isCollapsed ? "" : "mx-2"}
          transition-all duration-300
        `}>
          <motion.div
            className={`
              ${isCollapsed ? "w-8 h-8" : "w-12 h-12"} 
              mx-auto mb-2 rounded-full
              bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA]
              flex items-center justify-center
              shadow-md
              transition-all duration-300
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send size={isCollapsed ? 16 : 20} className="text-white" />
          </motion.div>
          
          {!isCollapsed && (
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center font-semibold text-gray-800 dark:text-gray-200"
            >
              HyperMail
            </motion.h3>
          )}
        </div>
        
        <Nav
          isCollapsed={isCollapsed}
          links={[
            {
              title: "Inbox",
              label: inboxThreads?.toString() ?? "0",
              icon: Inbox,
              variant: tab === "inbox" ? "default" : "ghost",
            },
            {
              title: "Drafts",
              label: draftThreads?.toString() ?? "0",
              icon: File,
              variant: tab === "drafts" ? "default" : "ghost",
            },
            {
              title: "Sent",
              label: sentThreads?.toString() ?? "0",
              icon: Send,
              variant: tab === "sent" ? "default" : "ghost",
            },
          ]}
        />
        
        {/* Notification area */}
        {/* {threadAccounts && Object.keys(threadAccounts.threadsByAccount).length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`
              mt-4 p-3 rounded-lg text-xs
              bg-amber-50 dark:bg-amber-900/30
              text-amber-600 dark:text-amber-400
              border border-amber-200 dark:border-amber-800
              ${isCollapsed ? "mx-1" : "mx-3"}
            `}
          >
            {isCollapsed ? (
              <div className="flex justify-center">
                <span className="animate-pulse">⚠️</span>
              </div>
            ) : (
              <>
                No threads found for this account.
                <div className="mt-1 font-medium">
                  Threads exist for account: {Object.keys(threadAccounts.threadsByAccount)[0]}
                </div>
              </>
            )}
          </motion.div>
        )} */}
      </div>
    </motion.div>
  );
};

export default Sidebar;