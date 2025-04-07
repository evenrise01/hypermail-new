"use client";
import React, { useState, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useLocalStorage } from "usehooks-ts";
import ThreadList from "./components/thread-list";
import ThreadDisplay from "./components/thread-display";
import SearchBar from "./components/search-bar";
import Sidebar from "./components/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = {
  defaultLayout?: number[];
  defaultCollapsed?: boolean;
};

const Mail = ({
  defaultLayout = [40, 60],
  defaultCollapsed = false,
}: Props) => {
  const [tab, setTab] = useLocalStorage<"inbox" | "drafts" | "sent">(
    "hypermail-tab",
    "inbox",
  );
  const [activeTab, setActiveTab] = useState("inbox");
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-full min-h-screen">
        {/* Sidebar - Now directly in the mail component */}
        <Sidebar 
          isCollapsed={isCollapsed} 
          toggleCollapse={() => setIsCollapsed(!isCollapsed)} 
        />

        {/* Main Content Area with Resizable Panels */}
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Thread List Panel */}
            <ResizablePanel defaultSize={defaultLayout[0]} minSize={30} maxSize={70}>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center px-4 py-1">
                  <motion.h1 layout className="text-xl font-bold capitalize">
                    {activeTab}
                  </motion.h1>
                  <TabsList className="ml-auto">
                    <TabsTrigger
                      value="inbox"
                      className="text-zinc-600 dark:text-zinc-200"
                      onClick={() => setTab("inbox")}
                    >
                      Inbox
                    </TabsTrigger>
                    <TabsTrigger
                      value="done"
                      className="text-zinc-600 dark:text-zinc-200"
                      onClick={() => setTab("done" as any)}
                    >
                      Done
                    </TabsTrigger>
                  </TabsList>
                </div>
                <Separator />
                <SearchBar />
                <div className="flex-1 overflow-auto">
                  <TabsContent value="inbox" className="m-0 h-full p-0">
                    <ThreadList />
                  </TabsContent>
                  <TabsContent value="done" className="m-0 h-full p-0">
                    <ThreadList />
                  </TabsContent>
                </div>
              </Tabs>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Thread Display Panel */}
            <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
              <ThreadDisplay />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Mail;