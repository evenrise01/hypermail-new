"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useThreads from "@/hooks/use-threads";
import {
  Archive,
  ArchiveX,
  Clock,
  MoreVertical,
  Trash2,
  Star,
  Reply,
  Forward,
  ArrowLeft,
  Inbox,
  ChevronDown,
  MessageSquare,
  Tag,
  BellOff,
  CheckCircle,
  CircleAlert,
  CircleMinus,
  CircleX,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import EmailDisplay from "./email-display";
import { motion, AnimatePresence } from "framer-motion";
import ReplyBox from "./reply-box";
import { useAtom } from "jotai";
import { isSearchingAtom, searchValueAtom } from "./search-bar";
import SearchDisplay from "./search-display";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useThreadActions } from "@/hooks/use-thread-actions";

const ThreadDisplay = () => {
  const { threadId, threads, setThreadId, account } = useThreads();
  const {
    archiveThread,
    trashThread,
    starThread,
    spamThread,
    markAsReadThread,
    markAsUnreadThread,
  } = useThreadActions();
  const thread = threads?.find((t) => t.id === threadId);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(true);
  const [searchValue] = useAtom(searchValueAtom);
  const [isSearching] = useAtom(isSearchingAtom);

  const setDone = api.account.setDone.useMutation();

  const handleMarkAsDone = async (value: string) => {
    if (!account) return;

    setDone.mutate(
      {
        threadId: threadId ?? undefined,
        accountId: account.id,
      },
      {
        onSuccess: () => {
          toast.success("Thread marked as Done successfully");
        },
        onError: () => {
          toast.error("Something went wrong while marking the thread as done");
        },
      },
    );
  };

  const handleBackToSearch = () => {
    setShowSearchResults(true);
    setThreadId(null);
  };

  const handleViewThread = (id: string) => {
    setThreadId(id);
    setShowSearchResults(false);
  };

  const ActionButton = ({
    icon,
    label,
    onClick,
  }: {
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
  }) => {
    return (
      <Button
        variant={"ghost"}
        size={"icon"}
        disabled={!thread}
        onClick={onClick}
        className="relative z-20 rounded-full transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-900/10 hover:to-purple-400/20"
        onMouseEnter={() => setHoveredButton(label)}
        onMouseLeave={() => setHoveredButton(null)}
      >
        <AnimatePresence>
          {hoveredButton === label && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 5 }}
              className="absolute -bottom-8 rounded-full bg-gradient-to-r from-blue-900 to-purple-400 px-3 py-1 text-xs whitespace-nowrap text-white shadow-lg"
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>
        {icon}
      </Button>
    );
  };

  const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white/90 shadow-lg backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/90">
      {/* Action Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center p-2 px-3"
      >
        <div className="flex items-center gap-1.5">
          <ActionButton
            icon={<Archive className="size-4" />}
            label="Archive"
            onClick={() =>
              threadId && account?.id && archiveThread(threadId, account.id)
            }
          />
          <ActionButton
            icon={<CircleX className="size-4" />}
            label="Mark as Unread"
            onClick={() =>
              threadId &&
              account?.id &&
              markAsUnreadThread(threadId, account.id)
            }
          />
          <ActionButton
            icon={<Trash2 className="size-4" />}
            label="Move to Trash"
            onClick={() =>
              threadId && account?.id && trashThread(threadId, account.id)
            }
          />
          <ActionButton
            icon={<CircleAlert className="size-4 text-red-500" />}
            label="Mark as Spam"
            onClick={() =>
              threadId && account?.id && spamThread(threadId, account.id)
            }
          />
          <ActionButton
            icon={<Star className="size-4 text-amber-500" />}
            label="Star"
            onClick={() =>
              threadId && account?.id && starThread(threadId, account.id)
            }
          />
        </div>
        <Separator
          orientation="vertical"
          className="mx-2 h-6 bg-blue-900/10 dark:bg-purple-400/10"
        />
        <div className="flex items-center gap-1.5">
          <ActionButton icon={<Reply className="size-4" />} label="Reply" />
          <ActionButton icon={<Forward className="size-4" />} label="Forward" />
          <ActionButton icon={<Tag className="size-4" />} label="Add Label" />
        </div>

        <div className="ml-auto flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                disabled={!thread}
                className="rounded-full hover:bg-gradient-to-r hover:from-blue-900/10 hover:to-purple-400/20"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl border border-gray-100 bg-white/95 p-1.5 shadow-lg backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95"
            >
              <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gradient-to-r hover:from-blue-900/10 hover:to-purple-400/20">
                <MessageSquare className="size-4 opacity-70" />
                Mark as unread
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gradient-to-r hover:from-blue-900/10 hover:to-purple-400/20">
                <Star className="size-4 opacity-70" />
                Star Thread
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gradient-to-r hover:from-blue-900/10 hover:to-purple-400/20">
                <Tag className="size-4 opacity-70" />
                Add Label
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gradient-to-r hover:from-blue-900/10 hover:to-purple-400/20">
                <BellOff className="size-4 opacity-70" />
                Mute Thread
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>
      <Separator className="bg-blue-900/10 dark:bg-purple-400/10" />

      {/* Conditional Rendering */}
      {isSearching ? (
        <>
          {showSearchResults ? (
            <SearchDisplay onThreadSelect={handleViewThread} />
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-10 flex items-center border-b border-blue-900/5 bg-white/90 p-2.5 backdrop-blur-md dark:border-purple-400/5 dark:bg-gray-900/90"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToSearch}
                  className="flex items-center gap-2 rounded-full text-sm transition-all hover:bg-gradient-to-r hover:from-blue-900/10 hover:to-purple-400/20"
                >
                  <ArrowLeft className="size-4" />
                  Back to search results
                </Button>
                <span className="ml-2 rounded-full bg-gradient-to-r from-blue-900/10 to-purple-400/10 px-3 py-1 text-sm text-blue-900/70 dark:text-purple-200/70">
                  {searchValue}
                </span>
              </motion.div>
              {thread ? <ThreadContent thread={thread} /> : null}
            </>
          )}
        </>
      ) : (
        <>
          {thread ? (
            <ThreadContent thread={thread} />
          ) : (
            <motion.div
              className="flex flex-1 items-center justify-center p-8"
              variants={emptyStateVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="max-w-md text-center">
                <motion.div
                  variants={itemVariants}
                  className="mb-6 inline-block rounded-full bg-gradient-to-r from-blue-900/10 to-purple-400/10 p-8"
                >
                  <Inbox className="size-12 text-blue-900 dark:text-purple-300" />
                </motion.div>
                <motion.h3
                  variants={itemVariants}
                  className="mb-3 bg-gradient-to-r from-blue-900 to-purple-500 bg-clip-text text-xl font-medium text-transparent dark:from-blue-400 dark:to-purple-300"
                >
                  Welcome to Hypermail
                </motion.h3>
                <motion.p
                  variants={itemVariants}
                  className="mb-6 text-sm text-blue-900/70 dark:text-purple-200/70"
                >
                  Select an email from your inbox to view it here, or use the
                  search bar to find specific emails.
                </motion.p>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

// Extracted ThreadContent component to improve readability
const ThreadContent = ({ thread }: { thread: any }) => {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center border-b border-blue-900/5 p-4 transition-all hover:bg-gradient-to-r hover:from-blue-900/5 hover:to-purple-400/10 dark:border-purple-400/5"
      >
        <div className="flex items-center gap-4 text-sm">
          <Avatar className="border-2 border-transparent shadow-sm transition-all hover:border-purple-400/70">
            <AvatarImage alt="avatar" />
            <AvatarFallback className="bg-gradient-to-r from-blue-900 to-purple-400 text-white">
              {thread.emails[0]?.from?.name
                ?.split(" ")
                .map((chunk: string) => chunk[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <div className="font-semibold transition-colors hover:text-blue-900 dark:hover:text-purple-300">
              {thread.emails[0]?.from.name}
              <div className="mt-1.5 line-clamp-1 text-xs font-normal">
                {thread.emails[0]?.subject}
              </div>
              <div className="mt-1 line-clamp-1 text-xs text-blue-900/60 dark:text-purple-200/60">
                <span className="font-medium">Reply-To:</span>{" "}
                {thread.emails[0]?.from?.address}
              </div>
            </div>
          </div>
        </div>
        {thread.emails[0]?.sentAt && (
          <div className="ml-auto flex flex-col items-end text-xs text-blue-900/60 dark:text-purple-200/60">
            <span>{format(new Date(thread.emails[0]?.sentAt), "PP")}</span>
            <span className="mt-1 text-xs">
              {format(new Date(thread.emails[0]?.sentAt), "p")}
            </span>
          </div>
        )}
      </motion.div>

      {/* Email Body */}
      <div className="scrollbar-thin scrollbar-thumb-purple-400/30 dark:scrollbar-thumb-blue-900/30 scrollbar-track-transparent flex max-h-[calc(100vh-400px)] flex-col overflow-auto">
        <div className="flex flex-col gap-6 p-6">
          {thread.emails.map((email: any, index: number) => {
            return (
              <motion.div
                key={email.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="rounded-xl border border-blue-900/5 bg-white/60 p-4 backdrop-blur-sm transition-all hover:border-blue-900/10 hover:shadow-md dark:border-purple-400/5 dark:bg-gray-900/60 dark:hover:border-purple-400/10"
              >
                <EmailDisplay key={email.id} email={email} />
              </motion.div>
            );
          })}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-auto"
      >
        <Separator className="bg-blue-900/10 dark:bg-purple-400/10" />
        {/* Reply Box */}
        <ReplyBox />
      </motion.div>
    </div>
  );
};

export default ThreadDisplay;
