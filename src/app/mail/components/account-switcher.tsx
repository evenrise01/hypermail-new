"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAurinkoAuthUrl } from "@/lib/aurinko";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { motion } from "framer-motion";
import { ChevronDown, Plus } from "lucide-react";
import React, { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

type Props = {
  isCollapsed: boolean;
};

const AccountSwitcher = ({ isCollapsed }: Props) => {
  const { data } = api.account.getAccounts.useQuery();
  const [accountId, setAccountId] = useLocalStorage("accountId", "");
  const [isOpen, setIsOpen] = useState(false);

  if (!data) return null;
  const selectedAccount = data.find((account) => account.id === accountId);
  const selectedAccountInitial = selectedAccount?.emailAddress?.[0]?.toUpperCase() || '?';

  // Calculate truncated email for display
  const getTruncatedEmail = (email: string, maxLength: number) => {
    if (!email) return '';
    if (email.length <= maxLength) return email;
    
    const atIndex = email.indexOf('@');
    if (atIndex === -1) return email.substring(0, maxLength) + '...';
    
    // Keep domain part intact if possible
    const domain = email.substring(atIndex);
    const usernameMaxLength = maxLength - domain.length - 3; // 3 for ellipsis
    
    if (usernameMaxLength < 3) {
      // If username would be too short, just truncate whole email
      return email.substring(0, maxLength) + '...';
    }
    
    // Truncate username part, keep domain
    const username = email.substring(0, atIndex);
    return username.substring(0, usernameMaxLength) + '...' + domain;
  };
  
  return (
    <Select 
      defaultValue={accountId} 
      onValueChange={setAccountId}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <SelectTrigger
        className={cn(
          "flex w-full flex-1 items-center gap-2 rounded-lg border-0 transition-all duration-300 ease-in-out",
          // Purple Paradise gradient in light mode, subtle version in dark mode
          "bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] text-white dark:from-[#1D2B64]/20 dark:to-[#F8CDDA]/20 dark:text-white",
          // Hover effects
          "hover:shadow-md hover:from-[#1D2B64] hover:to-[#F8CDDA]/90 dark:hover:from-[#1D2B64]/40 dark:hover:to-[#F8CDDA]/40",
          // Focus styles
          "focus:ring-2 focus:ring-[#F8CDDA]/50 dark:focus:ring-[#F8CDDA]/30",
          // Other utilities
          "[&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&>span]:flex [&>span]:items-center [&>span]:gap-1",
          // Hide the default select arrow
          "[&>svg]:hidden",
          // Styles when collapsed
          isCollapsed && "flex h-10 w-10 shrink-0 items-center justify-center rounded-full p-0 [&>span]:w-auto"
        )}
        aria-label="Select account"
      >
        <motion.div 
          className={cn(
            "flex items-center gap-2",
            isCollapsed ? "justify-center" : "justify-between w-full"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className={cn(
            "flex items-center gap-2 min-w-0",
            isCollapsed ? "justify-center" : ""
          )}>
            <div className={cn(
              "flex-shrink-0 h-7 w-7 items-center justify-center rounded-full bg-white text-[#1D2B64] font-medium text-sm shadow-sm flex",
              isOpen && "ring-2 ring-white/70"
            )}>
              {selectedAccountInitial}
            </div>
            {!isCollapsed && (
              <span className="ml-2 text-sm font-medium truncate text-white max-w-[150px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[250px]">
                {selectedAccount?.emailAddress}
              </span>
            )}
          </div>
          {!isCollapsed && (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0 ml-1"
            >
              <ChevronDown className="h-4 w-4 text-white dark:text-gray-200" />
            </motion.div>
          )}
        </motion.div>
      </SelectTrigger>
      
      <SelectContent className="border border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95 p-1 shadow-lg rounded-lg max-w-[280px] sm:max-w-[320px]">
        <div className="max-h-[300px] overflow-y-auto py-1">
          {data.map((account) => (
            <SelectItem 
              key={account.id} 
              value={account.id}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-all duration-150",
                "hover:bg-gradient-to-r hover:from-[#1D2B64]/10 hover:to-[#F8CDDA]/10",
                "dark:hover:from-[#1D2B64]/20 dark:hover:to-[#F8CDDA]/20",
                "focus:bg-gradient-to-r focus:from-[#1D2B64]/15 focus:to-[#F8CDDA]/15",
                "dark:focus:from-[#1D2B64]/25 dark:focus:to-[#F8CDDA]/25",
                account.id === accountId && "bg-gradient-to-r from-[#1D2B64]/20 to-[#F8CDDA]/20 dark:from-[#1D2B64]/30 dark:to-[#F8CDDA]/30"
              )}
            >
              <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] text-white font-medium text-xs">
                {account.emailAddress[0]?.toUpperCase()}
              </div>
              <span className="text-sm truncate">{account.emailAddress}</span>
            </SelectItem>
          ))}
        </div>
        
        <div className="mt-1 pt-1 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={async () => {
              const authUrl = await getAurinkoAuthUrl("Office365");
              window.location.href = authUrl;
            }}
            className={cn(
              "relative flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none transition-all duration-150",
              "hover:bg-gradient-to-r hover:from-[#1D2B64]/10 hover:to-[#F8CDDA]/10",
              "dark:hover:from-[#1D2B64]/20 dark:hover:to-[#F8CDDA]/20",
              "focus:outline-none focus:ring-2 focus:ring-[#F8CDDA]/30 dark:focus:ring-[#F8CDDA]/20",
            )}
          >
            <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-[#1D2B64]/30 to-[#F8CDDA]/30 dark:from-[#1D2B64]/40 dark:to-[#F8CDDA]/40">
              <Plus className="h-3.5 w-3.5 text-gray-700 dark:text-gray-300" />
            </div>
            <span>Add Account</span>
          </button>
        </div>
      </SelectContent>
    </Select>
  );
};

export default AccountSwitcher;