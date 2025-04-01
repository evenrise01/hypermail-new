"use client";
import React, { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Nav } from "./nav";
import { File, Inbox, Send } from "lucide-react";
import { api } from "@/trpc/react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";

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
  const { data: inboxThreads } = api.account.getNumThreads.useQuery(
    {
      accountId,
      tab: "inbox",
    },
    { enabled: !!accountId },
  );

  const { data: draftThreads } = api.account.getNumThreads.useQuery(
    {
      accountId,
      tab: "drafts",
    },
    { enabled: !!accountId },
  );

  const { data: sentThreads } = api.account.getNumThreads.useQuery(
    {
      accountId,
      tab: "sent",
    },
    { enabled: !!accountId },
  );

  // Automatically set accountId to an account that has threads (if we found one and none is selected)
  useEffect(() => {
    if (threadAccounts && !accountId) {
      const accountsWithThreads = Object.keys(threadAccounts.threadsByAccount);
      if (accountsWithThreads.length > 0) {
        const firstAccountWithThreads = accountsWithThreads[0];
        console.log(
          `Automatically selecting account ${firstAccountWithThreads} which has threads`,
        );
        setAccountId(firstAccountWithThreads!);
      }
    }
  }, [threadAccounts, accountId, setAccountId]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative h-full ${isCollapsed ? "w-16" : "w-64"} flex flex-col border-r transition-all duration-300 ease-in-out dark:border-gray-800`}
    >
      <div
        className={`absolute top-0 right-0 left-0 z-0 h-full rounded-br-3xl bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] opacity-70 dark:opacity-25`}
      />

      <div className="relative z-10 flex h-full flex-col p-2">
        <div
          className={`mb-6 rounded-lg px-2 py-4 ${isCollapsed ? "" : "mx-2"} transition-all duration-300`}
        >
          <motion.div
            className={` ${isCollapsed ? "h-8 w-8" : "h-12 w-12"} mx-auto mb-2 flex items-center justify-center rounded-full bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] shadow-md transition-all duration-300`}
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

        {/* Flexible spacer to push the theme toggle to the bottom */}
        <div className="flex-grow"></div>

        {/* Theme toggle positioned at the bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`mt-4 rounded-lg p-3 ${isCollapsed ? "mx-1" : "mx-3"} mb-2 border-t pt-4 dark:border-gray-800`}
        >
          {!isCollapsed && (
            <div className="mb-2 ml-2 inline-block rounded-md bg-white/40 px-2 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm dark:bg-gray-900/40 dark:text-gray-300">
              Appearance
            </div>
          )}
          <div
            className={`flex ${isCollapsed ? "justify-center" : "items-center justify-between"}`}
          >
            {!isCollapsed && <span className="text-sm">Theme</span>}
            <ThemeToggle />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
