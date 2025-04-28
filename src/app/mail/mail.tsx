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
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  defaultLayout?: number[];
  defaultCollapsed?: boolean;
};

const Mail = ({
  defaultLayout = [40, 60],
  defaultCollapsed = false,
}: Props) => {
  // const [unread, setUnread] = useLocalStorage('hypermail-unread', false)
  const [tab, setTab] = useLocalStorage<"inbox" | "drafts" | "sent" | "unread">(
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
        {/* Sidebar*/}
        <Sidebar
          isCollapsed={isCollapsed}
          toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />

        {/* Main Content Area with Resizable Panels */}
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Thread List Panel */}
            <ResizablePanel
              defaultSize={defaultLayout[0]}
              minSize={30}
              maxSize={70}
            >
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex h-full flex-col"
              >
                <div className="flex items-center px-2 py-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                  >
                    {isCollapsed ? <PanelLeftOpen /> : <PanelRightOpen />}
                  </Button>
                  <Separator orientation="vertical" className="mr-2"/>
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
                      value="unread"
                      className="text-zinc-600 dark:text-zinc-200"
                      onClick={() => setTab("unread")}
                    >
                      Unread
                    </TabsTrigger>
                  </TabsList>
                </div>
                <Separator />
                <SearchBar />
                <div className="h-full flex-1 overflow-auto">
                  <TabsContent value="inbox" className="m-0 h-full p-0">
                    <ThreadList />
                  </TabsContent>
                  <TabsContent value="drafts" className="m-0 h-full p-0">
                    <ThreadList />
                  </TabsContent>
                  
                  <TabsContent value="sent" className="m-0 h-full p-0">
                    <ThreadList />
                  </TabsContent>
                  <TabsContent value="archive" className="m-0 h-full p-0">
                    <ThreadList />
                  </TabsContent>
                  <TabsContent value="trash" className="m-0 h-full p-0">
                    <ThreadList />
                  </TabsContent>
                  <TabsContent value="star" className="m-0 h-full p-0">
                    <ThreadList />
                  </TabsContent>
                  <TabsContent value="unread" className="m-0 h-full p-0">
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
