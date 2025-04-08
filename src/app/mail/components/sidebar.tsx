"use client";
import React, { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import {
  File,
  Inbox,
  Send,
  ChevronsLeft,
  ChevronsRight,
  Trash2,
  BanIcon,
  Archive,
} from "lucide-react";
import { api } from "@/trpc/react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton } from "@clerk/nextjs";
import ComposeButton from "./compose-button";
import AskAI from "./ask-ai";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AccountSwitcher from "./account-switcher";
import PremiumBanner from "./premium-banner";

// Add these variants for the motion animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

type Props = {
  isCollapsed: boolean;
  toggleCollapse: () => void;
};

const Sidebar = ({ isCollapsed, toggleCollapse }: Props) => {
  const [_, setTab] = useLocalStorage("hypermail-tab", "inbox");
  const { theme } = useTheme();
  const [accountId, setAccountId] = useLocalStorage("accountId", "");
  const [tab] = useLocalStorage<"inbox" | "drafts" | "sent" | "junk" | "trash">(
    "hypermail-tab",
    "inbox",
  );

  const { data: threadAccounts } = api.account.findThreadAccounts.useQuery();
  const queryOptions = {
    enabled: !!accountId,
    refetchOnMount: true,
  };

  const { data: inboxThreads } = api.account.getNumThreads.useQuery(
    { accountId, tab: "inbox" },
    queryOptions,
  );
  const { data: draftThreads } = api.account.getNumThreads.useQuery(
    { accountId, tab: "drafts" },
    queryOptions,
  );
  const { data: sentThreads } = api.account.getNumThreads.useQuery(
    { accountId, tab: "sent" },
    queryOptions,
  );

  const archiveThreads = 0;
  const trashThreads = 0;

  useEffect(() => {
    if (threadAccounts && !accountId) {
      const accountsWithThreads = Object.keys(threadAccounts.threadsByAccount);
      if (accountsWithThreads.length > 0) {
        setAccountId(accountsWithThreads[0]!);
      }
    }
  }, [threadAccounts, accountId, setAccountId]);

  return (
    <div
      className={cn(
        "bg-background/95 supports-[backdrop-filter]:bg-background/60 relative flex h-full flex-col border-r backdrop-blur",
        isCollapsed ? "w-16" : "w-64",
        "transition-all duration-300 ease-in-out",
      )}
    >
      {/* Add AccountSwitcher at the top */}
      <div
        className={cn(
          "flex h-[54px] items-center justify-between",
          isCollapsed ? "px-1" : "px-4",
        )}
      >
        <AccountSwitcher isCollapsed={isCollapsed} />
      </div>
      <Separator />
      {/* Collapse Button - have been moved to mail.tsx beside the Inbox heading*/}
      {/* <div className="absolute top-4 right-0 -mr-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="border-background bg-background hover:bg-accent h-6 w-6 rounded-full border-2 shadow-sm"
              onClick={toggleCollapse}
            >
              {isCollapsed ? (
                <ChevronsRight className="h-4 w-4" />
              ) : (
                <ChevronsLeft className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {isCollapsed ? "Expand" : "Collapse"}
          </TooltipContent>
        </Tooltip>
      </div> */}

      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center space-x-2"
            >
              <Avatar className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600">
                <AvatarFallback className="bg-transparent">
                  <Send className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold">HyperMail</span>
              <Badge variant="secondary" className="text-xs">
                AI
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          <Tooltip disableHoverableContent={!isCollapsed}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setTab("inbox")}
                variant={tab === "inbox" ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start",
                  isCollapsed && "justify-center px-0",
                )}
              >
                <Inbox className="h-4 w-4" />
                {!isCollapsed && (
                  <>
                    <span className="ml-2">Inbox</span>
                    {inboxThreads && (
                      <Badge variant="default" className="ml-auto">
                        {inboxThreads}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Inbox {inboxThreads && `(${inboxThreads})`}
              </TooltipContent>
            )}
          </Tooltip>

          <Tooltip disableHoverableContent={!isCollapsed}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setTab("drafts")}
                variant={tab === "drafts" ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start",
                  isCollapsed && "justify-center px-0",
                )}
              >
                <File className="h-4 w-4" />
                {!isCollapsed && (
                  <>
                    <span className="ml-2">Drafts</span>
                    {draftThreads && (
                      <Badge variant="default" className="ml-auto">
                        {draftThreads}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Drafts {draftThreads && `(${draftThreads})`}
              </TooltipContent>
            )}
          </Tooltip>

          <Tooltip disableHoverableContent={!isCollapsed}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setTab("sent")}
                variant={tab === "sent" ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start",
                  isCollapsed && "justify-center px-0",
                )}
              >
                <Send className="h-4 w-4" />
                {!isCollapsed && (
                  <>
                    <span className="ml-2">Sent</span>
                    {sentThreads && (
                      <Badge variant="default" className="ml-auto">
                        {sentThreads}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Sent {sentThreads && `(${sentThreads})`}
              </TooltipContent>
            )}
          </Tooltip>

          {/* Archive Button */}
          <Tooltip disableHoverableContent={!isCollapsed}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setTab("junk")}
                variant={tab === "junk" ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start",
                  isCollapsed && "justify-center px-0",
                )}
              >
                <Archive className="h-4 w-4" />
                {!isCollapsed && (
                  <>
                    <span className="ml-2">Archive</span>
                    {archiveThreads && (
                      <Badge variant="default" className="ml-auto">
                        {archiveThreads}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Archive {archiveThreads && `(${archiveThreads})`}
              </TooltipContent>
            )}
          </Tooltip>

          {/* Trash Button */}
          <Tooltip disableHoverableContent={!isCollapsed}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setTab("trash")}
                variant={tab === "trash" ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start",
                  isCollapsed && "justify-center px-0",
                )}
              >
                <Trash2 className="h-4 w-4" />
                {!isCollapsed && (
                  <>
                    <span className="ml-2">Trash</span>
                    {trashThreads && (
                      <Badge variant="default" className="ml-auto">
                        {trashThreads}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Trash {trashThreads && `(${trashThreads})`}
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-2">
        <PremiumBanner isCollapsed={isCollapsed} />
        <AskAI isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
        <ComposeButton isCollapsed={isCollapsed} />

        {/* User Controls with glass effect */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className={cn(
            "space-y-4 rounded-xl border border-white/10 bg-white/5 py-3 backdrop-blur-sm dark:border-white/5 dark:bg-black/20",
            isCollapsed ? "px-1" : "px-3",
          )}
        >
          {/* Command Menu (K) */}
          {!isCollapsed && (
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex cursor-pointer items-center justify-between rounded-lg bg-black/5 px-2 py-2 dark:bg-white/5"
            >
              <span className="text-sm font-medium text-gray-700 transition-colors group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white">
                Command
              </span>
              <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                <span className="rounded bg-white/20 p-1 text-xs dark:bg-white/10">
                  ⌘
                </span>
                <span className="rounded bg-white/20 p-1 text-xs dark:bg-white/10">
                  K
                </span>
              </div>
            </motion.div>
          )}

          {/* User Button Section with hover effects */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "justify-between px-2",
            )}
          >
            {!isCollapsed && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile
              </span>
            )}
            <UserButton
              appearance={{
                elements: {
                  userButtonBox: "w-full h-full",
                  userButtonTrigger: {
                    width: "100%",
                    padding: isCollapsed ? "0" : "0.25rem 0.3rem",
                    borderRadius: "0.5rem",
                    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                  },
                  userButtonAvatarBox:
                    "ring-2 ring-offset-2 ring-offset-white/10 ring-indigo-500/30",
                },
              }}
            />
          </motion.div>

          {/* Theme Toggle with animation */}
          <motion.div
            variants={itemVariants}
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "justify-between px-2",
            )}
          >
            {!isCollapsed && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Theme
              </span>
            )}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
            >
              <ThemeToggle />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Sidebar;
