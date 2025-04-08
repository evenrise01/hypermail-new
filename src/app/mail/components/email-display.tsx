import { Letter } from 'react-letter'
import Avatar from "react-avatar";
import useThreads from "@/hooks/use-threads";
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/trpc/react";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, CornerUpRight, Star } from "lucide-react";

type Props = {
  email: RouterOutputs["account"]["getThreads"][0]["emails"][0];
};

const EmailDisplay = ({ email }: Props) => {
  const { account } = useThreads();
  const [isHovered, setIsHovered] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  // Check if the email is sent by me
  const isMe = account?.emailAddress === email.from.address;
  
  return (
    <div
      className={cn(
        "rounded-lg border p-0 transition-all duration-300 relative group",
        "shadow-sm hover:shadow-md",
        "bg-white dark:bg-gray-900",
        "border-gray-100 dark:border-gray-800",
        { 
          "border-l-4 border-l-indigo-500": isMe,
          "ml-6": !isMe // Add indentation for received emails
        }
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Message indicator for incoming emails */}
      {!isMe && (
        <div className="absolute -left-3 top-6 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center shadow-md transform transition-transform duration-300 group-hover:scale-110">
          <MessageSquare size={14} className="text-white" />
        </div>
      )}
      
      {/* Top section with avatar and metadata */}
      <div className="flex items-center justify-between gap-2 p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          {!isMe && (
            <div className="relative">
              <Avatar
                name={email.from.name ?? email.from.address}
                email={email.from.address}
                size="38"
                textSizeRatio={2}
                round={true}
                className={cn(
                  "transition-all duration-300 shadow-sm",
                  "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900",
                  isHovered ? "ring-indigo-500" : "ring-transparent"
                )}
              />
              <div className={cn(
                "absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500",
                "transform transition-all duration-300",
                isHovered ? "scale-125" : "scale-100"
              )} />
            </div>
          )}
          <div className="flex flex-col">
            <span className={cn(
              "font-medium text-gray-900 dark:text-gray-100",
              "transition-all duration-300",
              isHovered ? "text-indigo-600 dark:text-indigo-400" : ""
            )}>
              {isMe ? "Me" : email.from.name || email.from.address}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {email.from.address}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <p className="text-gray-500 dark:text-gray-400 text-xs font-mono">
            {formatDistanceToNow(email?.sentAt ?? new Date(), { addSuffix: true })}
          </p>
          
          {/* Actions that appear on hover */}
          <div className={cn(
            "flex gap-2 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <button 
              className="text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
              onClick={() => {}}
            >
              <CornerUpRight size={16} />
            </button>
            <button 
              className={cn(
                "transition-colors",
                isStarred ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"
              )}
              onClick={() => setIsStarred(!isStarred)}
            >
              <Star size={16} fill={isStarred ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Email content */}
      <div className="p-4">
        <Letter 
          html={email?.body ?? ''} 
          className={cn(
            "rounded-md p-4",
            "text-gray-800 dark:text-gray-200",
            "bg-gray-50 dark:bg-gray-800",
            "border-none"
          )}
        />
      </div>
      
      {/* Bottom action bar that appears on hover */}
      <div className={cn(
        "flex justify-end gap-3 p-3 border-t border-gray-100 dark:border-gray-800",
        "bg-gray-50 dark:bg-gray-800/50 rounded-b-lg",
        "transition-all duration-300",
        isHovered ? "opacity-100" : "opacity-0 h-0 overflow-hidden p-0 border-t-0"
      )}>
        <button className="px-3 py-1 text-xs rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600">
          Reply
        </button>
        <button className="px-3 py-1 text-xs rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600">
          Forward
        </button>
        <button className="px-3 py-1 text-xs rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-200 dark:border-indigo-800">
          AI Reply
        </button>
      </div>
    </div>
  );
};

export default EmailDisplay;