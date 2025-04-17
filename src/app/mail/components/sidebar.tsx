"use client";
import { useKBar } from "kbar";
import React, { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import {
  File,
  Inbox,
  Send,
  Trash2,
  Archive,
  Command,
  Star,
  Settings,
  MailX,
  CircleAlert,
} from "lucide-react";
import { api } from "@/trpc/react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AccountSwitcher from "./account-switcher";
import PremiumBanner from "./premium-banner";
import Logo from "public/HM_square.png";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [accountId, setAccountId] = useLocalStorage("accountId", "");
  const [tab] = useLocalStorage<
    "inbox" | "drafts" | "sent" | "archive" | "trash" | "star" | "spam"
  >("hypermail-tab", "inbox");

  const { data: counts } = api.thread.getThreadCounts.useQuery(
    { accountId },
    {
      enabled: !!accountId,
      refetchOnMount: true,
      refetchInterval: 30000, // Refresh every 30 seconds
    },
  );

  const { data: threadAccounts } = api.account.findThreadAccounts.useQuery();
  const queryOptions = {
    enabled: !!accountId,
    refetchOnMount: true,
  };

  useEffect(() => {
    if (threadAccounts && !accountId) {
      const accountsWithThreads = Object.keys(threadAccounts.threadsByAccount);
      if (accountsWithThreads.length > 0) {
        setAccountId(accountsWithThreads[0]!);
      }
    }
  }, [threadAccounts, accountId, setAccountId]);
  const { query } = useKBar();
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
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          {/* Logo - Always visible */}
          <div className="h-8 w-8">
            <Image
              src={Logo}
              alt="HyperMail Logo"
              className="h-full w-full object-contain"
              width={32}
              height={32}
            />
          </div>
          {/* Text and badge - Only visible when expanded */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center space-x-2"
              >
                <span className="font-semibold">HyperMail</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
                <Inbox className="h-5 w-5" />
                {!isCollapsed && (
                  <>
                    <span className="ml-2">Inbox</span>
                    {counts && (
                      <Badge variant="default" className="ml-auto">
                        {counts.inbox}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Inbox {counts && `(${counts.inbox})`}
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
                <File className="h-5 w-5" />
                {!isCollapsed && (
                  <>
                    <span className="ml-2">Drafts</span>
                    {counts && (
                      <Badge variant="default" className="ml-auto">
                        {counts.drafts}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Drafts {counts && `(${counts.drafts})`}
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
                <Send className="h-5 w-5" />
                {!isCollapsed && (
                  <>
                    <span className="ml-2">Sent</span>
                    {counts && (
                      <Badge variant="default" className="ml-auto">
                        {counts.sent}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Sent {counts && `(${counts.sent})`}
              </TooltipContent>
            )}
          </Tooltip>

          {/* Archive Button */}
          <Tooltip disableHoverableContent={!isCollapsed}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setTab("archive")}
                variant={tab === "archive" ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start",
                  isCollapsed && "justify-center px-0",
                )}
              >
                <Archive className="h-5 w-5" />
                {!isCollapsed && (
                  <>
                    <span className="ml-2">Archive</span>
                    {counts && (
                      <Badge variant="default" className="ml-auto">
                        {counts.archived}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Archive {counts && `(${counts.archived})`}
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
                <Trash2 className="h-5 w-5" />
                {!isCollapsed && (
                  <>
                    <span className="ml-2">Trash</span>
                    {counts && (
                      <Badge variant="default" className="ml-auto">
                        {counts.trashed}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Trash {counts && `(${counts.trashed})`}
              </TooltipContent>
            )}
          </Tooltip>

          {/* Spam Button */}
          <Tooltip disableHoverableContent={!isCollapsed}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setTab("spam")}
                variant={tab === "spam" ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start",
                  isCollapsed && "justify-center px-0",
                )}
              >
                <CircleAlert className="h-5 w-5" />
                {!isCollapsed && (
                  <>
                    <span className="ml-2">Spam</span>
                    {counts && (
                      <Badge variant="default" className="ml-auto">
                        {counts.spammed}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Spam {counts && `(${counts.spammed})`}
              </TooltipContent>
            )}
          </Tooltip>

          <Tooltip disableHoverableContent={!isCollapsed}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setTab("star")}
                variant={tab === "star" ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full justify-start",
                  isCollapsed && "justify-center px-0",
                )}
              >
                <Star className="h-5 w-5" />
                {!isCollapsed && (
                  <>
                    <span className="ml-2">Star</span>
                    {counts && (
                      <Badge variant="default" className="ml-auto">
                        {counts.starred}
                      </Badge>
                    )}
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Star {counts && `(${counts.starred})`}
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-2">
        <ComposeButton isCollapsed={isCollapsed} />
        <div className="h-4" />
        <PremiumBanner isCollapsed={isCollapsed} />
        <div className="h-4" />
        <AskAI isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />
        <div className="h-4" />

        {/* Bottom utilities section - simplified */}
        <div className="mt-1 px-2 pb-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={cn(
              "border-border/40 bg-muted/20 flex items-center justify-between rounded-lg border p-2",
              isCollapsed && "flex-col gap-4",
            )}
          >
            {/* Command menu trigger */}
            <Tooltip disableHoverableContent={!isCollapsed}>
              <TooltipTrigger asChild>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-md"
                  onClick={() => query.toggle()}
                >
                  <Command className="h-4 w-4" />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="right">Command Menu (⌘ + K)</TooltipContent>
            </Tooltip>

            {/* Theme toggle */}
            <Tooltip disableHoverableContent={!isCollapsed}>
              <TooltipTrigger asChild>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-md"
                >
                  <ThemeToggle />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="right">Toggle Theme</TooltipContent>
            </Tooltip>

            {/* Settings dropdown */}
            <Tooltip disableHoverableContent={!isCollapsed}>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-md"
                    >
                      <Settings className="h-4 w-4" />
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    side={isCollapsed ? "right" : "bottom"}
                    className="w-48"
                  >
                    <DropdownMenuLabel>Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Account</DropdownMenuItem>
                    <DropdownMenuItem>Preferences</DropdownMenuItem>
                    <DropdownMenuItem>Privacy</DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>

            {/* User profile button */}
            <Tooltip disableHoverableContent={!isCollapsed}>
              <TooltipTrigger asChild>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-md"
                >
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonBox: "w-full h-full",
                        userButtonTrigger: {
                          width: "100%",
                          height: "100%",
                          padding: "0",
                        },
                        userButtonAvatarBox: "w-full h-full",
                      },
                    }}
                  />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="right">Profile</TooltipContent>
            </Tooltip>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
