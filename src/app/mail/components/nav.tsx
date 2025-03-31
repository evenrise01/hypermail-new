"use client";

import Link from "next/link";
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
  const [_, setTab] = useLocalStorage("hypermail-tab", "inbox");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      data-collapsed={isCollapsed}
      initial="hidden"
      animate="show"
      variants={container}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-2 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <motion.span
                  variants={item}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTab(link.title.toLowerCase())}
                  className={cn(
                    buttonVariants({ variant: link.variant, size: "icon" }),
                    "h-10 w-10 cursor-pointer rounded-lg transition-all duration-300 ease-in-out",
                    link.variant === "default"
                      ? "bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] text-white shadow-md hover:shadow-lg hover:from-[#1D2B64] hover:to-[#F8CDDA]/90 focus:ring-2 focus:ring-[#F8CDDA]/50 dark:focus:ring-[#F8CDDA]/30"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-[#1D2B64]/10 hover:to-[#F8CDDA]/10 dark:hover:from-[#1D2B64]/20 dark:hover:to-[#F8CDDA]/20 dark:hover:text-white focus:ring-2 focus:ring-[#F8CDDA]/30 dark:focus:ring-[#F8CDDA]/20"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  <span className="sr-only">{link.title}</span>
                </motion.span>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="flex items-center gap-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg"
              >
                {link.title}
                {link.label && (
                  <span className="ml-auto font-semibold text-[#1D2B64] dark:text-[#F8CDDA]">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <motion.span
              key={index}
              variants={item}
              whileHover={{ scale: 1.02, x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTab(link.title.toLowerCase())}
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                "justify-start cursor-pointer px-3 py-2 h-10 rounded-lg transition-all duration-300 ease-in-out",
                link.variant === "default"
                  ? "bg-gradient-to-r from-[#1D2B64] to-[#F8CDDA] text-white shadow-md hover:shadow-lg hover:from-[#1D2B64] hover:to-[#F8CDDA]/90 focus:ring-2 focus:ring-[#F8CDDA]/50 dark:focus:ring-[#F8CDDA]/30"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-[#1D2B64]/10 hover:to-[#F8CDDA]/10 dark:hover:from-[#1D2B64]/20 dark:hover:to-[#F8CDDA]/20 focus:ring-2 focus:ring-[#F8CDDA]/30 dark:focus:ring-[#F8CDDA]/20"
              )}
            >
              <link.icon className="mr-2 h-5 w-5" />
              {link.title}
              {link.label && (
                <span
                  className={cn(
                    "ml-auto font-medium",
                    link.variant === "default"
                      ? "text-white"
                      : "text-[#1D2B64] dark:text-[#F8CDDA]"
                  )}
                >
                  {link.label}
                </span>
              )}
            </motion.span>
          )
        )}
      </nav>
    </motion.div>
  );
}