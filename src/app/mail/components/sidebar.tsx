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

// Motion animation variants
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setTab] = useLocalStorage("hypermail-tab", "inbox");
  const [accountId, setAccountId] = useLocalStorage("accountId", "");
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

  const { data: counts } = api.thread.getThreadCounts.useQuery(
    { accountId },
    {
      enabled: !!accountId,
      refetchOnMount: true,
      refetchInterval: 30000, // Refresh every 30 seconds
    },
  );

  const { data: threadAccounts } = api.account.findThreadAccounts.useQuery();

  useEffect(() => {
    if (threadAccounts && !accountId) {
      const accountsWithThreads = Object.keys(threadAccounts.threadsByAccount);
      if (accountsWithThreads.length > 0) {
        setAccountId(accountsWithThreads[0]!);
      }
    }
  }, [threadAccounts, accountId, setAccountId]);

  const { query } = useKBar();

  const navItems = [
    {
      icon: <Inbox className="h-4 w-4" />,
      label: "Inbox",
      value: "inbox",
      count: counts?.inbox,
    },
    {
      icon: <File className="h-4 w-4" />,
      label: "Drafts",
      value: "drafts",
      count: counts?.drafts,
    },
    {
      icon: <Send className="h-4 w-4" />,
      label: "Sent",
      value: "sent",
      count: counts?.sent,
    },
    {
      icon: <Archive className="h-4 w-4" />,
      label: "Archive",
      value: "archive",
      count: counts?.archived,
    },
    {
      icon: <Trash2 className="h-4 w-4" />,
      label: "Trash",
      value: "trash",
      count: counts?.trashed,
    },
    {
      icon: <CircleAlert className="h-4 w-4" />,
      label: "Spam",
      value: "spam",
      count: counts?.spammed,
    },
    {
      icon: <Star className="h-4 w-4" />,
      label: "Star",
      value: "star",
      count: counts?.starred,
    },
  ];

  const quickActions = [
    {
      icon: <Command className="h-4 w-4" />,
      label: "Command Menu",
      onClick: () => query.toggle(),
      tooltip: "Command Menu (⌘ + K)",
    },
    {
      icon: <ThemeToggle />,
      label: "Toggle Theme",
      tooltip: "Toggle Theme",
    },
    {
      icon: <Settings className="h-4 w-4" />,
      label: "Settings",
      tooltip: "Settings",
      dropdown: true,
    },
    {
      icon: (
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
      ),
      label: "Profile",
      tooltip: "Profile",
    },
  ];

  return (
    <div
      className={cn(
        "bg-background border-border relative flex h-full flex-col border-r",
        isCollapsed ? "w-16" : "w-64",
        "transition-all duration-300 ease-in-out",
      )}
    >
      {/* Account Switcher */}
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
          <div className="bg-muted h-8 w-8 overflow-hidden rounded-md">
            <Image
              src={Logo}
              alt="HyperMail Logo"
              className="h-full w-full object-contain p-1"
              width={32}
              height={32}
            />
          </div>
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
      <Separator className="bg-gray-800" />

      {/* Command bar style button */}
      <div className="px-4 py-3">
        <Button
          onClick={() => query.toggle()}
          variant="outline"
          className="bg-background/30 hover:bg-accent/50 text-muted-foreground w-full justify-between"
        >
          <div className="flex items-center">
            <Command className="mr-2 h-4 w-4" />
            {!isCollapsed && <span>Type a command...</span>}
          </div>
          {!isCollapsed && (
            <div className="bg-muted rounded px-2 py-1 text-xs">⌘K</div>
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Tooltip key={item.value} disableHoverableContent={!isCollapsed}>
              <TooltipTrigger asChild>
                <Button
                //eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onClick={() => setTab(item.value as any)}
                  variant={tab === item.value ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "hover:bg-accent/50 w-full justify-start bg-transparent",
                    tab === item.value && "bg-accent/50",
                    isCollapsed && "justify-center px-0",
                  )}
                >
                  {item.icon}
                  {!isCollapsed && (
                    <>
                      <span className="ml-2 text-sm">{item.label}</span>
                      {item.count !== undefined && (
                        <Badge
                          variant="outline"
                          className="bg-muted text-muted-foreground ml-auto text-xs"
                        >
                          {item.count}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  {item.label} {item.count !== undefined && `(${item.count})`}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3 p-2">
        <ComposeButton isCollapsed={isCollapsed} />
        <PremiumBanner isCollapsed={isCollapsed} />
        <AskAI isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />

        {/* Bottom actions */}
        <div className="mt-1 px-2 pb-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className={cn(
              "border-border bg-muted/30 flex items-center justify-between rounded-lg border p-2",
              isCollapsed && "flex-col gap-4",
            )}
          >
            {quickActions.map((action, index) => (
              <Tooltip key={index} disableHoverableContent={!isCollapsed}>
                <TooltipTrigger asChild>
                  {action.dropdown ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <motion.div
                          variants={itemVariants}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="hover:bg-accent/50 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md"
                        >
                          {action.icon}
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
                  ) : (
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="hover:bg-accent/50 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md"
                      onClick={action.onClick}
                    >
                      {action.icon}
                    </motion.div>
                  )}
                </TooltipTrigger>
                <TooltipContent side="right">{action.tooltip}</TooltipContent>
              </Tooltip>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
