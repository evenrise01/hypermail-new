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
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Mail, Sparkles } from "lucide-react";
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

  // Get color based on email domain
  const getInitialColor = (email: string) => {
    if (!email) return { bg: "#3b82f6", text: "#ffffff" };
    
    const domain = email.split('@')[1] || '';
    
    // Map common email domains to specific colors
    if (domain.includes('gmail')) return { bg: "#ea4335", text: "#ffffff" };
    if (domain.includes('outlook') || domain.includes('hotmail')) return { bg: "#0078d4", text: "#ffffff" };
    if (domain.includes('yahoo')) return { bg: "#6001d2", text: "#ffffff" };
    if (domain.includes('proton')) return { bg: "#6d4aff", text: "#ffffff" };
    
    // Generate a consistent color based on the domain string
    const hash = Array.from(domain).reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const hue = Math.abs(hash % 360);
    return { bg: `hsl(${hue}, 70%, 45%)`, text: "#ffffff" };
  };
  
  const avatarColor = selectedAccount ? getInitialColor(selectedAccount.emailAddress) : { bg: "#3b82f6", text: "#ffffff" };

  return (
    <Select 
      defaultValue={accountId} 
      onValueChange={setAccountId}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <SelectTrigger
        className={cn(
          "flex w-full items-center gap-2 rounded-xl border-0 transition-all duration-300 ease-out",
          // Futuristic glass morphism style
          "bg-gradient-to-br from-indigo-500/10 to-purple-500/5 backdrop-blur-sm",
          "dark:from-indigo-600/20 dark:to-purple-500/10 dark:text-white",
          // Border glow effect
          "ring-1 ring-white/20 dark:ring-white/10",
          // Hover effects
          "hover:from-indigo-500/20 hover:to-purple-500/10 hover:shadow-lg hover:shadow-indigo-500/10",
          "dark:hover:from-indigo-600/30 dark:hover:to-purple-500/20 dark:hover:shadow-indigo-600/20",
          // Focus styles
          "focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/30",
          // Other utilities
          "[&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&>span]:flex [&>span]:items-center [&>span]:gap-1",
          // Hide the default select arrow
          "[&>svg]:hidden",
          // Styles when collapsed
          isCollapsed && "h-10 w-10 shrink-0 justify-center rounded-full p-0 [&>span]:w-auto"
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
            <motion.div 
              className={cn(
                "flex-shrink-0 h-7 w-7 items-center justify-center rounded-full font-medium text-sm flex",
                isOpen && "ring-2 ring-white/30 dark:ring-white/20"
              )}
              style={{ 
                backgroundColor: avatarColor.bg,
                color: avatarColor.text 
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {selectedAccountInitial}
            </motion.div>
            {!isCollapsed && (
              <AnimatePresence>
                <motion.span 
                  className="ml-2 text-sm font-medium truncate text-gray-800 dark:text-gray-200 max-w-[150px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[250px]"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {selectedAccount?.emailAddress}
                </motion.span>
              </AnimatePresence>
            )}
          </div>
          {!isCollapsed && (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              className="flex-shrink-0 ml-1"
            >
              <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </motion.div>
          )}
        </motion.div>
      </SelectTrigger>
      
      <SelectContent className="border-0 bg-white/80 backdrop-blur-md dark:bg-gray-900/90 p-2 shadow-xl rounded-xl max-w-[280px] sm:max-w-[320px] ring-1 ring-indigo-500/20 dark:ring-purple-500/20">
        <motion.div 
          className="max-h-[300px] overflow-y-auto py-1 space-y-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {data.map((account, index) => {
            const colors = getInitialColor(account.emailAddress);
            
            return (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <SelectItem 
                  value={account.id}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200",
                    "hover:bg-indigo-50 dark:hover:bg-indigo-900/30",
                    "focus:bg-indigo-100 dark:focus:bg-indigo-800/40",
                    "focus:outline-none focus:ring-1 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/30",
                    account.id === accountId && "bg-indigo-50 dark:bg-indigo-900/20"
                  )}
                >
                  <div 
                    className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full text-white font-medium text-xs"
                    style={{ backgroundColor: colors.bg }}
                  >
                    {account.emailAddress[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm truncate text-gray-800 dark:text-gray-200">
                    {account.emailAddress}
                  </span>
                  {account.id === accountId && (
                    <motion.div 
                      className="ml-auto"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      <div className="h-2 w-2 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>
                    </motion.div>
                  )}
                </SelectItem>
              </motion.div>
            );
          })}
        </motion.div>
        
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700/50">
          <button
            onClick={async () => {
              const authUrl = await getAurinkoAuthUrl("Office365");
              window.location.href = authUrl;
            }}
            className={cn(
              "relative flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200",
              "bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20",
              "hover:from-indigo-100 hover:to-purple-100/70 dark:hover:from-indigo-800/30 dark:hover:to-purple-800/30",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500/40 dark:focus:ring-indigo-400/30",
              "group"
            )}
          >
            <div className="flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white overflow-hidden">
              <motion.div
                initial={{ y: 12 }}
                whileHover={{ y: -12 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <Plus className="h-4 w-4" />
                <Sparkles className="h-4 w-4 mt-2" />
              </motion.div>
            </div>
            <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-200">
              Add Account
            </span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Mail className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
            </div>
          </button>
        </div>
      </SelectContent>
    </Select>
  );
};

export default AccountSwitcher;