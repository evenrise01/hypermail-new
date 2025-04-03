"use client";

import { Letter } from 'react-letter'
import Avatar from "react-avatar";
import useThreads from "@/hooks/use-threads";
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/react";
import React from "react";
import { formatDistanceToNow } from "date-fns";

type Props = {
  email: RouterOutputs["account"]["getThreads"][0]["emails"][0];
};

const EmailDisplay = ({ email }: Props) => {
  const { account } = useThreads();

  // Check if the email is sent by me
  const isMe = account?.emailAddress === email.from.address;
  
  return (
    <div
      className={cn(
        "rounded-md border p-4 transition-all hover:translate-x-2 bg-card text-card-foreground",
        { 
          "border-l-4 border-l-primary": isMe,
          "ml-6 border-r-4 border-r-primary": !isMe // Add indentation for received emails
        }
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {!isMe && (
            <Avatar
              name={email.from.name ?? email.from.address}
              email={email.from.address}
              size="35"
              textSizeRatio={2}
              round={true}
              className="border-2 border-transparent hover:border-primary transition-colors"
            />
          )}
          <span className="font-medium">
            {isMe ? "Me" : email.from.name || email.from.address}
          </span>
        </div>
        <p className="text-muted-foreground text-xs">
          {formatDistanceToNow(email.sentAt ?? new Date(), { addSuffix: true })}
        </p>
      </div>
      
      <div className="h-4"></div>
      
      <Letter 
        html={email?.body ?? ''} 
        className={cn(
          "rounded-md p-4 bg-white dark:bg-gray-900",
          "text-gray-900 dark:text-gray-100",
          "border border-gray-200 dark:border-gray-700"
        )}
      />
    </div>
  );
};

export default EmailDisplay;