'use client'
import {
    type Action,
    KBarProvider,
    KBarPortal,
    KBarPositioner,
    KBarAnimator,
    KBarSearch,
    Priority,
} from "kbar";
import RenderResults from "./render-results";
import { useLocalStorage } from "usehooks-ts";
import useAccountSwitching from "./use-account-switching";
import useThemeSwitching from "./use-theme-switching";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAtom } from "jotai";
// import { isSearchingAtom } from "../search-bar";
// import { useThread } from "../../use-thread";

export default function KBar({ children }: { children: React.ReactNode }) {
    // const [isSearching, setIsSearching] = useAtom(isSearchingAtom)
    const [_, setTab] = useLocalStorage(`hypermail-tab`, 'inbox')
    // const [threadId, setThreadId] = useThread()
    const [done, setDone] = useLocalStorage('hypermail-done', false)

    const actions: Action[] = [
        {
            id: "inboxAction",
            name: "Inbox",
            shortcut: ["g", 'i'],
            keywords: "inbox",
            section: "Navigation",
            subtitle: "View your inbox",
            perform: () => {
                setTab('inbox')
            },
        },
        {
            id: "draftsAction",
            name: "Drafts",
            shortcut: ['g', 'r'], // Changed from 'd' to 'r' (for drafts)
            keywords: "drafts",
            priority: Priority.HIGH,
            subtitle: "View your drafts",
            section: "Navigation",
            perform: () => {
                setTab('drafts')
            },
        },
        {
            id: "sentAction",
            name: "Sent",
            shortcut: ['g', "s"],
            keywords: "sent",
            section: "Navigation",
            subtitle: "View the sent",
            perform: () => {
                setTab('sent')
            },
        },
        {
            id: "pendingAction",
            name: "See done",
            shortcut: ['g', "e"], // Changed from 'd' to 'e' (for done)
            keywords: "done",
            section: "Navigation",
            subtitle: "View the done emails",
            perform: () => {
                setDone(true)
            },
        },
        {
            id: "doneAction",
            name: "See Pending",
            shortcut: ['g', "u"],
            keywords: 'pending, undone, not done',
            section: "Navigation",
            subtitle: "View the pending emails",
            perform: () => {
                setDone(false)
            },
        },
    ];
    
    return (
        <KBarProvider actions={actions}>
            <ActualComponent>
                {children}
            </ActualComponent>
        </KBarProvider>
    )
}

const ActualComponent = ({ children }: { children: React.ReactNode }) => {
    useAccountSwitching()
    useThemeSwitching()

     return (
        <>
            <KBarPortal>
                <KBarPositioner className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md scrollbar-hide !p-0 z-[99999]">
                    <KBarAnimator className="max-w-xl w-full mx-auto bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden relative mt-32 ">
                        <div className="bg-white dark:bg-gray-900">
                            <div className="relative border-b border-gray-200 dark:border-gray-800">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </div>
                                <KBarSearch className="py-4 pl-12 pr-6 text-base w-full bg-white dark:bg-gray-900 outline-none border-none focus:outline-none focus:ring-0 text-gray-800 dark:text-gray-200 placeholder-gray-400" placeholder="Search commands..." />
                            </div>
                            <RenderResults />
                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/60 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
                                <div className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">⬆</kbd>
                                        <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">⬇</kbd>
                                        <span>to navigate</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">↵</kbd>
                                        <span>to select</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">ESC</kbd>
                                        <span>to close</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </KBarAnimator>
                </KBarPositioner>
            </KBarPortal>
            {children}
        </>
    )
}