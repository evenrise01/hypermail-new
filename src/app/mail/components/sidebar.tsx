"use client";
import React, { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Nav } from "./nav";
import { File, Inbox, Send } from "lucide-react";
import { api } from "@/trpc/react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton } from "@clerk/nextjs";
import ComposeButton from "./compose-button";

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
      style={{
        // Ensure proper containment for the gradient
        overflow: "hidden",
      }}
    >
      <div
        className={`absolute inset-0 z-0 rounded-br-3xl bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] opacity-70 dark:opacity-25`}
        style={{
          // Ensure gradient covers entire area including when resized
          width: "100%",
          height: "100%",
          // Prevent gradient from being cut off during animations
          willChange: "transform",
        }}
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

        {/* Flexible spacer to push the compose button and user controls to the bottom */}
        <div className="flex-grow"></div>

        {/* Compose Button with proper styling for sidebar context */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={`${isCollapsed ? "px-1" : "px-3"} mb-4`}
        >
          <div
            className={`${isCollapsed ? "scale-90" : ""} transition-transform duration-300`}
          >
            <ComposeButton isCollapsed={isCollapsed} />
          </div>
        </motion.div>

        {/* User button and theme toggle container */}
        <div className={`space-y-4 ${isCollapsed ? "px-1" : "px-3"}`}>
          {/* User Button Section */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between px-1"}`}
          >
            {!isCollapsed && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Profile
              </span>
            )}
            <UserButton
              appearance={{
                elements: {
                  userButtonBox: "w-full h-full",
                  userButtonTrigger: {
                    width: "100%",
                    padding: isCollapsed ? "0" : "0.25rem 0.3rem",
                    borderRadius: "0.375rem",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  },
                },
              }}
            />
          </motion.div>

          {/* Theme Toggle Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between px-2"}`}
          >
            {!isCollapsed && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Theme
              </span>
            )}
            <ThemeToggle />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;