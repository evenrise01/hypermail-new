"use client";
import React, { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Nav } from "./nav";
import { File, Inbox, Send } from "lucide-react";
import { api } from "@/trpc/react";

type Props = {
  isCollapsed: boolean;
};

const Sidebar = ({ isCollapsed }: Props) => {
  const [accountId, setAccountId] = useLocalStorage("accountId", "");
  const [tab] = useLocalStorage<"inbox" | "drafts" | "sent">(
    "hypermail-tab",
    "inbox",
  );

  // Add debug query to find which account has threads
  const { data: threadAccounts } = api.account.findThreadAccounts.useQuery();

  // Get counts for the currently selected account
  const { data: inboxThreads } = api.account.getNumThreads.useQuery({
    accountId,
    tab: "inbox",
  }, { enabled: !!accountId });
  
  const { data: draftThreads } = api.account.getNumThreads.useQuery({
    accountId,
    tab: "drafts",
  }, { enabled: !!accountId });
  
  const { data: sentThreads } = api.account.getNumThreads.useQuery({
    accountId,
    tab: "sent",
  }, { enabled: !!accountId });

  // Automatically set accountId to an account that has threads (if we found one and none is selected)
  useEffect(() => {
    if (threadAccounts && (!accountId || accountId === "106826")) {
      const accountsWithThreads = Object.keys(threadAccounts.threadsByAccount);
      if (accountsWithThreads.length > 0) {
        const firstAccountWithThreads = accountsWithThreads[0];
        console.log(`Automatically selecting account ${firstAccountWithThreads} which has threads`);
        setAccountId(firstAccountWithThreads!);
      }
    }
  }, [threadAccounts, accountId, setAccountId]);

  // Debug logging
  useEffect(() => {
    if (threadAccounts) {
      console.log("Thread accounts:", threadAccounts);
      console.log("Currently selected account:", accountId);
    }
  }, [threadAccounts, accountId]);

  return (
    <div>
      <Nav
        isCollapsed={isCollapsed}
        links={[
          {
            title: "Inbox",
            label: inboxThreads?.toString() ?? "0",
            icon: Inbox,
            variant: tab === "inbox" ? "default" : "ghost",
          },
          {
            title: "Drafts",
            label: draftThreads?.toString() ?? "0",
            icon: File,
            variant: tab === "drafts" ? "default" : "ghost",
          },
          {
            title: "Sent",
            label: sentThreads?.toString() ?? "0",
            icon: Send,
            variant: tab === "sent" ? "default" : "ghost",
          },
        ]}
      />
      
      {/* Optional: Add a small debug section */}
      {threadAccounts && Object.keys(threadAccounts.threadsByAccount).length > 0 && accountId === "106826" && (
        <div className="p-2 text-xs text-amber-500">
          No threads found for this account. 
          Threads exist for account: {Object.keys(threadAccounts.threadsByAccount)[0]}
        </div>
      )}
    </div>
  );
};

export default Sidebar;