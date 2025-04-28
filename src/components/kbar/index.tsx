"use client";
import {
  type Action,
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
} from "kbar";
import { motion, AnimatePresence } from "framer-motion";
import RenderResults from "./render-results";
import { useLocalStorage } from "usehooks-ts";
import useAccountSwitching from "./use-account-switching";
import useThemeSwitching from "./use-theme-switching";
import type { ComposeButtonHandle } from "@/app/mail/components/compose-button";
import { useRef } from "react";

export default function KBar({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setTab] = useLocalStorage(`hypermail-tab`, "inbox");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [done, setDone] = useLocalStorage("hypermail-done", false);
  const composeRef = useRef<ComposeButtonHandle>(null);
  const actions: Action[] = [
    {
      id: "composeAction",
      name: "Compose new email",
      shortcut: ["c"],
      keywords: "write, new, create, message, email",
      section: "ACTIONS",
      perform: () => {
        composeRef.current?.openCompose();
        // Focus the "To" field after a small delay
        setTimeout(() => {
          document.getElementById("email-to-input")?.focus();
        }, 100);
      },
    },
    {
      id: "searchAction",
      name: "Search all emails",
      shortcut: ["s"],
      keywords: "find, search, filter, emails",
      section: "ACTIONS",
      perform: () => {
        // Add search functionality
      },
    },
    {
      id: "contactsAction",
      name: "Go to contacts",
      shortcut: ["g", "c"],
      keywords: "contacts, people, address book",
      section: "ACTIONS",
      perform: () => {
        // Navigate to contacts
      },
    },
    {
      id: "scheduleAction",
      name: "Schedule sending",
      shortcut: ["g", "s"],
      keywords: "schedule, delay, later, timed",
      section: "ACTIONS",
      perform: () => {
        // Schedule sending functionality
      },
    },
    {
      id: "aiResponseAction",
      name: "Generate AI response",
      shortcut: ["g", "a"],
      keywords: "ai, generate, assistant, smart, reply",
      section: "ACTIONS",
      perform: () => {
        // AI response generation
      },
    },
    {
      id: "settingsAction",
      name: "Open settings",
      shortcut: ["g", "o"],
      keywords: "settings, preferences, configure",
      section: "ACTIONS",
      perform: () => {
        // Open settings
      },
    },
    {
      id: "layoutAction",
      name: "Change layout",
      shortcut: ["g", "l"],
      keywords: "layout, view, display, interface",
      section: "ACTIONS",
      perform: () => {
        // Change layout
      },
    },
    {
      id: "analyticsAction",
      name: "View analytics",
      shortcut: ["g", "v"],
      keywords: "analytics, stats, data, metrics",
      section: "ACTIONS",
      perform: () => {
        // View analytics
      },
    },
  ];

  return (
    <KBarProvider actions={actions}>
      <ActualComponent>{children}</ActualComponent>
    </KBarProvider>
  );
}

const ActualComponent = ({ children }: { children: React.ReactNode }) => {
  useAccountSwitching();
  useThemeSwitching();

  return (
    <>
      <KBarPortal>
        <KBarPositioner className="fixed inset-0 z-[99999] flex items-start justify-center bg-black/70 !p-0 backdrop-blur-sm">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mx-auto mt-12 w-full max-w-xl"
            >
              <KBarAnimator className="relative overflow-hidden rounded-lg border border-gray-800 bg-[#151515] shadow-2xl">
                <div>
                  <div className="relative">
                    <div className="absolute top-1/2 left-4 -translate-y-1/2 transform text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M13 10h7a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5"></path>
                        <path d="M10 9V6a1 1 0 0 1 1-1h2"></path>
                        <path d="M11 13h10"></path>
                        <path d="M15 19h6"></path>
                        <path d="M9 19h2"></path>
                      </svg>
                    </div>
                    <KBarSearch
                      className="w-full border-b border-none border-gray-800 bg-[#151515] py-3.5 pr-6 pl-12 text-sm text-gray-300 placeholder-gray-500 outline-none focus:ring-0 focus:outline-none"
                      placeholder="Type a command or search..."
                    />
                    <div className="absolute top-1/2 right-4 flex -translate-y-1/2 transform items-center space-x-2 text-gray-500">
                      <kbd className="rounded bg-gray-800 px-1.5 py-0.5 text-xs">
                        ⌘
                      </kbd>
                      <kbd className="rounded bg-gray-800 px-1.5 py-0.5 text-xs">
                        K
                      </kbd>
                    </div>
                  </div>
                  <RenderResults />
                  <div className="flex justify-between border-t border-gray-800 bg-[#151515] px-3 py-2.5 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <kbd className="rounded bg-gray-800 px-1.5 py-0.5 text-xs">
                          ↑
                        </kbd>
                        <kbd className="ml-1 rounded bg-gray-800 px-1.5 py-0.5 text-xs">
                          ↓
                        </kbd>
                      </div>
                      <span>to navigate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="rounded bg-gray-800 px-1.5 py-0.5 text-xs">
                        ↵
                      </kbd>
                      <span>to select</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <kbd className="rounded bg-gray-800 px-1.5 py-0.5 text-xs">
                        Esc
                      </kbd>
                      <span>to close</span>
                    </div>
                  </div>
                </div>
              </KBarAnimator>
            </motion.div>
          </AnimatePresence>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
};
