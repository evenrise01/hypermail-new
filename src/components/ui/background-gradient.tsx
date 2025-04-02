// components/ui/background-gradient.tsx
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  return (
    <div className={cn("relative p-[2px] group w-fit", containerClassName)}> {/* Increased from p-[1px] */}
      <motion.div
        animate={
          animate
            ? {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                transition: {
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                },
              }
            : undefined
        }
        className={cn(
          "absolute inset-0 z-[1] opacity-80 group-hover:opacity-100 transition duration-500", // Increased opacity
          "bg-[linear-gradient(45deg,transparent_10%,hsl(210,80%,60%)_25%,hsl(280,80%,60%)_75%,transparent_90%)]", // Adjusted gradient stops
          "bg-[length:400%_400%]" // Larger gradient pattern
        )}
      />
      <div className={cn("relative z-10 bg-background", className)}>
        {children}
      </div>
    </div>
  );
};