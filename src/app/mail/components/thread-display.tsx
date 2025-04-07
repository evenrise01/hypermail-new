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
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import EmailDisplay from "./email-display";
import { motion } from "framer-motion";
import ReplyBox from "./reply-box";
import { useAtom } from "jotai";
import { isSearchingAtom, searchValueAtom } from "./search-bar";
import SearchDisplay from "./search-display";

const ThreadDisplay = () => {
  const { threadId, threads, setThreadId } = useThreads();
  const thread = threads?.find((t) => t.id === threadId);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(true);
  const [searchValue] = useAtom(searchValueAtom);
  const [isSearching] = useAtom(isSearchingAtom);

  const handleBackToSearch = () => {
    setShowSearchResults(true);
    setThreadId(null);
  };

  const handleViewThread = (id: string) => {
    setThreadId(id);
    setShowSearchResults(false)
  }

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
        className="relative rounded-full transition-all duration-200 hover:bg-gradient-to-r hover:from-[#1D2B64]/10 hover:to-[#F8CDDA]/20 z-20"
        onMouseEnter={() => setHoveredButton(label)}
        onMouseLeave={() => setHoveredButton(null)}
      >
        {hoveredButton === label && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -bottom-6 rounded bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] px-2 py-1 text-xs whitespace-nowrap text-white"
          >
            {label}
          </motion.div>
        )}
        {icon}
      </Button>
    );
  };

  return (
    <div className="text-card-foreground flex h-full flex-col rounded-lg border bg-white/90 shadow-md backdrop-blur-sm dark:bg-gray-900/90">
      {/* Buttons Row */}
      <div className="flex items-center p-2">
        <div className="flex items-center gap-1">
          <ActionButton icon={<Archive className="size-4" />} label="Archive" onClick={handleBackToSearch} />
          <ActionButton
            icon={<ArchiveX className="size-4" />}
            label="Archive & Mark as Read"
          />
          <ActionButton icon={<Trash2 className="size-4" />} label="Delete" />
        </div>
        <Separator
          orientation="vertical"
          className="mx-2 h-6 bg-[#1D2B64]/20 dark:bg-[#F8CDDA]/20"
        />
        <ActionButton icon={<Clock className="size-4" />} label="Snooze" />
        <Separator
          orientation="vertical"
          className="mx-2 h-6 bg-[#1D2B64]/20 dark:bg-[#F8CDDA]/20"
        />
        <div className="flex items-center gap-1">
          <ActionButton icon={<Star className="size-4" />} label="Star" />
          <ActionButton icon={<Reply className="size-4" />} label="Reply" />
          <ActionButton icon={<Forward className="size-4" />} label="Forward" />
        </div>

        <div className="ml-auto flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                disabled={!thread}
                className="rounded-full hover:bg-gradient-to-r hover:from-[#1D2B64]/10 hover:to-[#F8CDDA]/20"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-lg border-0 bg-white/95 p-1 shadow-lg backdrop-blur-sm dark:bg-gray-900/95"
            >
              <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-sm transition-colors hover:bg-gradient-to-r hover:from-[#1D2B64]/10 hover:to-[#F8CDDA]/20">
                Mark as unread
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-sm transition-colors hover:bg-gradient-to-r hover:from-[#1D2B64]/10 hover:to-[#F8CDDA]/20">
                Star Thread
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-sm transition-colors hover:bg-gradient-to-r hover:from-[#1D2B64]/10 hover:to-[#F8CDDA]/20">
                Add Label
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-sm transition-colors hover:bg-gradient-to-r hover:from-[#1D2B64]/10 hover:to-[#F8CDDA]/20">
                Mute Thread
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator className="bg-[#1D2B64]/10 dark:bg-[#F8CDDA]/10" />
      {/* Thread Display */}

      {/* Conditional Rendering */}
      {isSearching ? (
        <>
          {showSearchResults ? (
            <SearchDisplay onThreadSelect={handleViewThread} />
          ) : (
            <>
              <div className="sticky top-0 z-10 flex items-center bg-white/80 p-2 backdrop-blur-sm dark:bg-gray-900/80">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToSearch}
                  className="flex items-center gap-1 text-sm"
                >
                  <ArrowLeft className="size-4" />
                  Back to search results
                </Button>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {searchValue}
                </span>
              </div>
              {thread ? (
                <div className="flex flex-1 flex-col overflow-hidden">
                  <div className="flex items-center p-4 transition-colors hover:bg-gradient-to-r hover:from-[#1D2B64]/5 hover:to-[#F8CDDA]/10">
                    <div className="flex items-center gap-4 text-sm">
                      <Avatar className="border-2 border-transparent transition-all hover:border-[#F8CDDA]/70">
                        <AvatarImage alt="avatar" />
                        <AvatarFallback className="bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] text-white">
                          {thread.emails[0]?.from?.name
                            ?.split(" ")
                            .map((chunk) => chunk[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <div className="font-semibold transition-colors hover:text-[#1D2B64] dark:hover:text-[#F8CDDA]">
                          {thread.emails[0]?.from.name}
                          <div className="mt-1 line-clamp-1 text-xs font-normal">
                            {thread.emails[0]?.subject}
                          </div>
                          <div className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                            <span className="font-medium">Reply-To:</span>{" "}
                            {thread.emails[0]?.from?.address}
                          </div>
                        </div>
                      </div>
                    </div>
                    {thread.emails[0]?.sentAt && (
                      <div className="text-muted-foreground ml-auto flex flex-col items-end text-xs">
                        <span>
                          {format(new Date(thread.emails[0]?.sentAt), "PP")}
                        </span>
                        <span className="mt-1 text-xs">
                          {format(new Date(thread.emails[0]?.sentAt), "p")}
                        </span>
                      </div>
                    )}
                  </div>
                  <Separator className="bg-[#1D2B64]/10 dark:bg-[#F8CDDA]/10" />
                  {/* Email Body */}
                  <div className="scrollbar-thin scrollbar-thumb-[#F8CDDA]/50 dark:scrollbar-thumb-[#1D2B64]/50 scrollbar-track-transparent flex max-h-[calc(100vh-400px)] flex-col overflow-auto">
                    <div className="flex flex-col gap-4 p-6">
                      {thread.emails.map((email, index) => {
                        return (
                          <motion.div
                            key={email.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <EmailDisplay key={email.id} email={email} />
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-6">
                    <Separator className="bg-[#1D2B64]/10 dark:bg-[#F8CDDA]/10" />
                    {/* Reply Box */}
                    <ReplyBox />
                  </div>
                </div>
              ) : null}
            </>
          )}
        </>
      ) : (
        <>
          {thread ? (
            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="flex items-center p-4 transition-colors hover:bg-gradient-to-r hover:from-[#1D2B64]/5 hover:to-[#F8CDDA]/10">
                <div className="flex items-center gap-4 text-sm">
                  <Avatar className="border-2 border-transparent transition-all hover:border-[#F8CDDA]/70">
                    <AvatarImage alt="avatar" />
                    <AvatarFallback className="bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] text-white">
                      {thread.emails[0]?.from?.name
                        ?.split(" ")
                        .map((chunk) => chunk[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <div className="font-semibold transition-colors hover:text-[#1D2B64] dark:hover:text-[#F8CDDA]">
                      {thread.emails[0]?.from.name}
                      <div className="mt-1 line-clamp-1 text-xs font-normal">
                        {thread.emails[0]?.subject}
                      </div>
                      <div className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                        <span className="font-medium">Reply-To:</span>{" "}
                        {thread.emails[0]?.from?.address}
                      </div>
                    </div>
                  </div>
                </div>
                {thread.emails[0]?.sentAt && (
                  <div className="text-muted-foreground ml-auto flex flex-col items-end text-xs">
                    <span>
                      {format(new Date(thread.emails[0]?.sentAt), "PP")}
                    </span>
                    <span className="mt-1 text-xs">
                      {format(new Date(thread.emails[0]?.sentAt), "p")}
                    </span>
                  </div>
                )}
              </div>
              <Separator className="bg-[#1D2B64]/10 dark:bg-[#F8CDDA]/10" />
              {/* Email Body */}
              <div className="scrollbar-thin scrollbar-thumb-[#F8CDDA]/50 dark:scrollbar-thumb-[#1D2B64]/50 scrollbar-track-transparent flex max-h-[calc(100vh-400px)] flex-col overflow-auto">
                <div className="flex flex-col gap-4 p-6">
                  {thread.emails.map((email, index) => {
                    return (
                      <motion.div
                        key={email.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <EmailDisplay key={email.id} email={email} />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-6">
                <Separator className="bg-[#1D2B64]/10 dark:bg-[#F8CDDA]/10" />
                {/* Reply Box */}
                <ReplyBox />
              </div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="p-8 text-center">
                <div className="mb-4 inline-block rounded-full bg-gradient-to-r from-[#1D2B64]/20 to-[#F8CDDA]/20 p-6">
                  <ArchiveX className="size-8 text-[#1D2B64] dark:text-[#F8CDDA]" />
                </div>
                <h3 className="mb-2 text-lg font-medium">No message selected</h3>
                <p className="text-muted-foreground text-sm">
                  Select a message from your inbox to view it here
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ThreadDisplay;
