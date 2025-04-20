"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";
import Image from "next/image";
import Logo from "public/HM_square.png";
import { cn } from "@/lib/utils";
import {
  Loader2,
  Mail,
  UserCircle,
  MessageCircle,
  FileTextIcon,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import useThreads from "@/hooks/use-threads";

// Main loader component that acts as a wrapper for your dashboard
const HypermailLoader = ({ children }: { children: React.ReactNode }) => {
  const [accountId, setAccountId] = useLocalStorage("accountId", "");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [visualStep, setVisualStep] = useState(0); // New state for visual step display

  // Get the thread counts
  const {
    data: counts,
    isLoading: isLoadingThreadCount,
    isSuccess: isThreadCountSuccess,
  } = api.thread.getThreadCounts.useQuery({ accountId });

  // Get accounts data separately to verify account loading step
  const {
    data: accounts,
    isLoading: isLoadingAccounts,
    isSuccess: isAccountsSuccess,
  } = api.account.getAccounts.useQuery();

  // Fetch the threads
  const { threads, isLoading: isLoadingThreads, account } = useThreads();

  const {
    data: chatbotInteraction,
    isLoading: isLoadingChat,
    isSuccess: isChatSuccess,
  } = api.account.getChatbotInteraction.useQuery();

  // Update actual loading state based on data
  useEffect(() => {
    const steps = [
      {
        name: "Accounts",
        completed: !isLoadingAccounts && isAccountsSuccess && !!accounts,
      },
      {
        name: "Thread Count",
        completed: !isLoadingThreadCount && !!counts && isThreadCountSuccess,
      },
      {
        name: "Threads",
        completed: !isLoadingThreads && !!threads,
      },
      {
        name: "Chatbot",
        completed: !isLoadingChat && isChatSuccess && !!chatbotInteraction,
      },
    ];

    // Calculate current step (actual data loading progress)
    let currentStep = 0;
    for (let i = 0; i < steps.length; i++) {
      if (steps[i]!.completed) {
        currentStep = i + 1;
      } else {
        break;
      }
    }
    setLoadingStep(currentStep);

    // Check if all steps are complete to eventually exit the loader
    const allComplete = steps.every((step) => step.completed);
    if (allComplete && visualStep >= steps.length) {
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [
    isLoadingAccounts,
    isLoadingThreadCount,
    isLoadingThreads,
    isLoadingChat,
    accounts,
    counts,
    threads,
    chatbotInteraction,
    isAccountsSuccess,
    isThreadCountSuccess,
    isChatSuccess,
    visualStep
  ]);

  // Sequential visual animation for loading steps
  useEffect(() => {
    // Only advance to next visual step if the real data for that step is ready
    if (visualStep < loadingStep) {
      const stepDelay = setTimeout(() => {
        setVisualStep((prev) => prev + 1);
        // Update progress with a smooth animation
        const nextProgress = ((visualStep + 1) / 4) * 100;
        let currentProgress = loadingProgress;
        const progressInterval = setInterval(() => {
          if (currentProgress < nextProgress) {
            setLoadingProgress((prev) => Math.min(prev + 1, nextProgress));
            currentProgress += 1;
          } else {
            clearInterval(progressInterval);
          }
        }, 15);
        
        return () => clearInterval(progressInterval);
      }, 500); // 0.5 second delay between steps
      
      return () => clearTimeout(stepDelay);
    }
  }, [visualStep, loadingStep, loadingProgress]);

  // Loading messages
  const loadingMessages = [
    "Connecting to Hypermail...",
    "Syncing your emails...",
    "Loading AI features...",
    "Almost ready...",
  ];

  // Loading step items - simplified to match the steps we check
  const loadingSteps = [
    {
      id: "accounts",
      icon: <UserCircle className="h-5 w-5" />,
      text: "Loading accounts",
    },
    {
      id: "inbox",
      icon: <FileTextIcon className="h-5 w-5" />,
      text: "Counting your mails",
    },
    {
      id: "threads",
      icon: <Mail className="h-5 w-5" />,
      text: "Fetching emails",
    },
    {
      id: "chatbot",
      icon: <MessageCircle className="h-5 w-5" />,
      text: "Waking up the chatbot",
    },
  ];

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-background fixed inset-0 flex flex-col items-center justify-center"
        >
          <div className="flex max-w-md flex-col items-center px-4 text-center">
            {/* Logo with modern zoom animation */}
            <div className="relative mb-8">
              {/* Background glow effect */}
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 blur-lg"
              />

              {/* Logo with zoom animation */}
              <motion.div
                animate={{
                  scale: [1, 0.95, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  ease: "easeInOut",
                  times: [0, 0.4, 0.8, 1],
                  repeat: Infinity,
                }}
                className="relative z-10"
              >
                <Image
                  src={Logo}
                  alt="HyperMail Logo"
                  width={120}
                  height={120}
                  className="h-32 w-32 drop-shadow-lg"
                  style={{
                    filter: "drop-shadow(0 8px 16px rgba(104, 58, 252, 0.2))",
                  }}
                />
              </motion.div>

              {/* Optional: Subtle rotating ring effect */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 12,
                  ease: "linear",
                  repeat: Infinity,
                }}
                className="absolute rounded-full border-2 border-indigo-500/10 dark:border-indigo-400/10"
                style={{ borderRadius: "50%" }}
              />
            </div>

            {/* Loading text */}
            <motion.h1
              className="mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent dark:from-indigo-400 dark:to-purple-400"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              HyperMail
            </motion.h1>
            <motion.p
              key={visualStep}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-muted-foreground mb-8 text-sm"
            >
              {
                loadingMessages[
                  Math.min(visualStep, loadingMessages.length - 1)
                ]
              }
            </motion.p>

            {/* Progress bar */}
            <div className="mb-8 w-full max-w-xs">
              <Progress
                value={loadingProgress}
                className="h-1.5 bg-gray-100 dark:bg-gray-800"
                style={{
                  backgroundImage:
                    loadingProgress > 0
                      ? "linear-gradient(to right, rgb(99, 102, 241), rgb(168, 85, 247))"
                      : undefined,
                }}
              />
            </div>

            {/* Loading steps */}
            <div className="space-y-3">
              {loadingSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.2 },
                  }}
                  className="flex items-center space-x-3"
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border",
                      visualStep > index
                        ? "border-green-500 bg-green-500/10 text-green-500"
                        : visualStep === index
                          ? "animate-pulse border-indigo-500 bg-indigo-500/10 text-indigo-500"
                          : "border-gray-300 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800",
                    )}
                  >
                    {visualStep > index ? (
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </motion.svg>
                    ) : visualStep === index ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm",
                      visualStep > index
                        ? "text-green-600 dark:text-green-400"
                        : visualStep === index
                          ? "text-foreground"
                          : "text-muted-foreground",
                    )}
                  >
                    {step.text}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="h-full w-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HypermailLoader;