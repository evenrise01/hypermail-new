"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocalStorage } from "usehooks-ts";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setTab] = useLocalStorage("hypermail-tab", "inbox");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 350, 
        damping: 25 
      } 
    },
  };

  // Function to determine badge styling based on count
  const getBadgeStyle = (count: string) => {
    const numCount = parseInt(count);
    if (numCount === 0) return "bg-gray-400/30 dark:bg-gray-600/30";
    if (numCount > 9) return "bg-red-500/80 dark:bg-red-600/80";
    return "bg-blue-500/80 dark:bg-blue-600/80";
  };

  return (
    <motion.div
      data-collapsed={isCollapsed}
      initial="hidden"
      animate="show"
      variants={container}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-3 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={100}>
              <TooltipTrigger asChild>
                <motion.div
                  variants={item}
                  whileHover={{ 
                    scale: 1.08,
                    boxShadow: link.variant === "default" ? 
                      "0 0 15px rgba(80, 60, 240, 0.5)" : 
                      "0 0 8px rgba(80, 60, 240, 0.2)" 
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTab(link.title.toLowerCase())}
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    "relative h-11 w-11 cursor-pointer rounded-xl transition-all duration-300 ease-out",
                    link.variant === "default"
                      ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-md shadow-indigo-500/30 dark:shadow-indigo-900/30 hover:shadow-lg hover:shadow-indigo-500/40 dark:hover:shadow-indigo-900/40 focus:ring-2 focus:ring-indigo-400/50 dark:focus:ring-indigo-400/30"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-br hover:from-indigo-600/10 hover:via-purple-600/10 hover:to-pink-500/10 dark:hover:from-indigo-600/20 dark:hover:via-purple-600/20 dark:hover:to-pink-500/20 dark:hover:text-white focus:ring-2 focus:ring-indigo-400/30 dark:focus:ring-indigo-400/20"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label && link.label !== "0" && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={cn(
                        "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white",
                        getBadgeStyle(link.label)
                      )}
                    >
                      {parseInt(link.label) > 9 ? "9+" : link.label}
                    </motion.span>
                  )}
                  <span className="sr-only">{link.title}</span>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="flex items-center gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20 dark:border-gray-700/50 shadow-lg rounded-lg py-2 px-3"
              >
                {link.title}
                {link.label && link.label !== "0" && (
                  <span className="ml-auto font-semibold text-indigo-600 dark:text-indigo-400">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ 
                scale: 1.02, 
                x: 3,
                boxShadow: link.variant === "default" ? 
                  "0 0 15px rgba(80, 60, 240, 0.4)" : 
                  "0 0 8px rgba(80, 60, 240, 0.1)" 
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTab(link.title.toLowerCase())}
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                "justify-start cursor-pointer px-4 py-2.5 h-11 rounded-xl transition-all duration-300 ease-out",
                link.variant === "default"
                  ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-md shadow-indigo-500/30 dark:shadow-indigo-900/30 hover:shadow-lg hover:shadow-indigo-500/40 dark:hover:shadow-indigo-900/40 focus:ring-2 focus:ring-indigo-400/50 dark:focus:ring-indigo-400/30"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-br hover:from-indigo-600/10 hover:via-purple-600/10 hover:to-pink-500/10 dark:hover:from-indigo-600/15 dark:hover:via-purple-600/15 dark:hover:to-pink-500/15 focus:ring-2 focus:ring-indigo-400/30 dark:focus:ring-indigo-400/20"
              )}
            >
              <link.icon className="mr-3 h-5 w-5" />
              <span className="font-medium">{link.title}</span>
              {link.label && (
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  className={cn(
                    "ml-auto flex min-w-6 h-6 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                    link.variant === "default"
                      ? "bg-white/20 text-white"
                      : getBadgeStyle(link.label) + " text-white"
                  )}
                >
                  {link.label}
                </motion.span>
              )}
            </motion.div>
          )
        )}
      </nav>
    </motion.div>
  );
}