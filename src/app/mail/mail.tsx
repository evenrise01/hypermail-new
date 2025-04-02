"use client";
import React, { useState, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import AccountSwitcher from "./components/account-switcher";
import Sidebar from "./components/sidebar";
import ThreadList from "./components/thread-list";
import ThreadDisplay from "./components/thread-display";
import { useLocalStorage } from "usehooks-ts";

type Props = {
  defaultLayout: number[] | undefined;
  navCollapsedSize: number;
  defaultCollapsed: boolean;
};

const Mail = ({
  defaultLayout = [16, 32, 48],
  navCollapsedSize,
  defaultCollapsed,
}: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [layout, setLayout] = useState(defaultLayout);
  const [tab, setTab] = useLocalStorage<"inbox" | "drafts" | "sent">(
    "hypermail-tab",
    "inbox",
  );
  const [activeTab, setActiveTab] = useState("inbox");

  // Update the tab title when the local storage tab changes
  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  // Handle layout changes and save them
  const handleLayout = (sizes: number[]) => {
    setLayout(sizes);
    console.log(sizes);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={handleLayout}
        className="h-full min-h-screen items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={16}
          maxSize={16}
          onCollapse={() => {
            setIsCollapsed(true);
          }}
          onResize={(size) => {
            setIsCollapsed(false);
          }}
          className={cn(
            isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out",
            "flex flex-col"
          )}
        >
          <div className="flex h-full flex-1 flex-col">
            <div
              className={cn(
                "flex h-[54px] items-center justify-between",
                isCollapsed ? "h-[54px]" : "px-2",
              )}
            >
              {/* Account Switcher */}
              <AccountSwitcher isCollapsed={isCollapsed} />
            </div>
            <div className="flex h-[calc(100%-54px)] flex-col">
              <Separator />
              <div className="flex-grow overflow-auto">
                {/* Sidebar */}
                <Sidebar isCollapsed={isCollapsed} />
              </div>
              <div className="mt-auto p-3">
                {/* AI - Keeping as placeholder */}
                <div
                  className={cn(
                    "text-sm font-medium",
                    isCollapsed ? "text-center" : "",
                    "rounded-lg bg-gradient-to-br from-amber-100/50 to-orange-200/50 px-2 py-1.5 dark:from-amber-800/20 dark:to-orange-900/20",
                  )}
                >
                  Ask AI
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={defaultLayout[1]}
          minSize={30}
          className="flex flex-col"
        >
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

            {/* Search Bar */}
            <div className="px-4 py-2">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                <Input
                  placeholder="Search emails..."
                  className="bg-background pl-8 focus-visible:ring-amber-500 dark:bg-gray-900/50"
                />
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <TabsContent value="inbox" className="m-0 h-full p-0">
                <div className="h-full">
                  <ThreadList />
                </div>
              </TabsContent>
              <TabsContent value="done" className="m-0 h-full p-0">
                <div className="h-full">
                  <ThreadList />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={defaultLayout[2]}
          minSize={30}
          className="overflow-hidden"
        >
          <ThreadDisplay />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
};

export default Mail;
