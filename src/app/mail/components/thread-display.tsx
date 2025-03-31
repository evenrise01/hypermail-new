"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useThreads from "@/hooks/use-threads";
import { Archive, ArchiveX, Clock, MoreVertical, Trash2, Star, Reply, Forward } from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import EmailDisplay from "./email-display";
import { motion } from "framer-motion";
import ReplyBox from "./reply-box";

const ThreadDisplay = () => {
  const { threadId, threads } = useThreads();
  const thread = threads?.find((t) => t.id === threadId);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const ActionButton = ({ 
    icon, 
    label, 
    onClick 
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
        className="relative rounded-full transition-all duration-200 hover:bg-gradient-to-r hover:from-[#1D2B64]/10 hover:to-[#F8CDDA]/20"
        onMouseEnter={() => setHoveredButton(label)}
        onMouseLeave={() => setHoveredButton(null)}
      >
        {hoveredButton === label && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -bottom-6 whitespace-nowrap rounded bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] px-2 py-1 text-xs text-white"
          >
            {label}
          </motion.div>
        )}
        {icon}
      </Button>
    );
  };

  return (
    <div className="flex h-full flex-col rounded-lg border bg-white/90 dark:bg-gray-900/90 text-card-foreground shadow-md backdrop-blur-sm">
      {/* Buttons Row */}
      <div className="flex items-center p-2">
        <div className="flex items-center gap-1">
          <ActionButton icon={<Archive className="size-4" />} label="Archive" />
          <ActionButton icon={<ArchiveX className="size-4" />} label="Archive & Mark as Read" />
          <ActionButton icon={<Trash2 className="size-4" />} label="Delete" />
        </div>
        <Separator orientation="vertical" className="mx-2 h-6 bg-[#1D2B64]/20 dark:bg-[#F8CDDA]/20" />
        <ActionButton icon={<Clock className="size-4" />} label="Snooze" />
        <Separator orientation="vertical" className="mx-2 h-6 bg-[#1D2B64]/20 dark:bg-[#F8CDDA]/20" />
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
            <DropdownMenuContent align="end" className="w-56 rounded-lg border-0 bg-white/95 backdrop-blur-sm dark:bg-gray-900/95 p-1 shadow-lg">
              <DropdownMenuItem className="rounded-md cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-gradient-to-r hover:from-[#1D2B64]/10 hover:to-[#F8CDDA]/20">
                Mark as unread
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-md cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-gradient-to-r hover:from-[#1D2B64]/10 hover:to-[#F8CDDA]/20">
                Star Thread
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-md cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-gradient-to-r hover:from-[#1D2B64]/10 hover:to-[#F8CDDA]/20">
                Add Label
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-md cursor-pointer px-3 py-2 text-sm transition-colors hover:bg-gradient-to-r hover:from-[#1D2B64]/10 hover:to-[#F8CDDA]/20">
                Mute Thread
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator className="bg-[#1D2B64]/10 dark:bg-[#F8CDDA]/10" />
      {/* Thread Display */}

      {thread ? (
        <>
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center p-4 hover:bg-gradient-to-r hover:from-[#1D2B64]/5 hover:to-[#F8CDDA]/10 transition-colors">
              <div className="flex items-center gap-4 text-sm">
                <Avatar className="border-2 border-transparent hover:border-[#F8CDDA]/70 transition-all">
                  <AvatarImage alt="avatar" />
                  <AvatarFallback className="bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] text-white">
                    {thread.emails[0]?.from?.name
                      ?.split(" ")
                      .map((chunk) => chunk[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="font-semibold hover:text-[#1D2B64] dark:hover:text-[#F8CDDA] transition-colors">
                    {thread.emails[0]?.from.name}
                    <div className="line-clamp-1 text-xs font-normal mt-1">
                      {thread.emails[0]?.subject}
                    </div>
                    <div className="line-clamp-1 text-xs text-muted-foreground mt-0.5">
                      <span className="font-medium">Reply-To:</span>{" "}
                      {thread.emails[0]?.from?.address}
                    </div>
                  </div>
                </div>
              </div>
              {thread.emails[0]?.sentAt && (
                <div className="text-muted-foreground ml-auto text-xs flex flex-col items-end">
                  <span>{format(new Date(thread.emails[0]?.sentAt), "PP")}</span>
                  <span className="text-xs mt-1">{format(new Date(thread.emails[0]?.sentAt), "p")}</span>
                </div>
              )}
            </div>
            <Separator className="bg-[#1D2B64]/10 dark:bg-[#F8CDDA]/10" />
            {/* Email Body */}
            <div className="flex max-h-[calc(100vh-350px)] flex-col overflow-auto scrollbar-thin scrollbar-thumb-[#F8CDDA]/50 dark:scrollbar-thumb-[#1D2B64]/50 scrollbar-track-transparent">
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
              <ReplyBox/>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center p-8">
              <div className="bg-gradient-to-r from-[#1D2B64]/20 to-[#F8CDDA]/20 p-6 rounded-full mb-4 inline-block">
                <ArchiveX className="size-8 text-[#1D2B64] dark:text-[#F8CDDA]" />
              </div>
              <h3 className="text-lg font-medium mb-2">No message selected</h3>
              <p className="text-muted-foreground text-sm">Select a message from your inbox to view it here</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThreadDisplay;