"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressBarProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  showAnimation?: boolean;
}

export function ProgressBar({ 
  className, 
  value = 0, 
  showAnimation = true,
  ...props 
}: ProgressBarProps) {
  return (
    <ProgressPrimitive.Root
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-orange-50",
        className
      )}
      {...props}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-orange-50/50 animate-pulse" />
      
      {/* Progress indicator */}
      <ProgressPrimitive.Indicator
        asChild
      >
        <motion.div 
          className="h-full w-full flex-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 relative"
          style={{
            backgroundSize: "200% 100%",
          }}
          initial={{ x: "-100%" }}
          animate={{ 
            // @ts-ignore
            x: `${value - 100}%`,
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            x: { duration: showAnimation ? 0.3 : 0, ease: "easeInOut" },
            backgroundPosition: {
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />
        </motion.div>
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  );
}