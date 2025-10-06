"use client";

import { cn } from "@/lib/utils";
import { motion, type SVGMotionProps } from "framer-motion";
import { appConfig } from "root/project.config";

const pathVariants = {
  hidden: { pathLength: 0, fillOpacity: 0 },
  visible: {
    pathLength: 1,
    fillOpacity: 1,
    transition: { duration: 1.5, ease: "easeInOut" },
  },
} as const;

const textVariants = {
  hidden: { opacity: 0, letterSpacing: "0.3em" },
  visible: {
    opacity: 1,
    letterSpacing: "0em",
    transition: { duration: 1.5, ease: "easeInOut" },
  },
} as const;



const sizes = {
  xs: "h-5.5",
  sm: "h-7",
  md: "h-8",
  lg: "h-12",
  xl: "h-14",
};

export const Logo = ({
  draw = false,
  size = "sm",
  className,
  containerClassName,
  ...props
}: {
  containerClassName?: string;
  draw?: boolean;
  size?: keyof typeof sizes;
} & SVGMotionProps<SVGSVGElement>) => {
  return (
    <div className={cn("relative flex items-center", containerClassName)}>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 4932.44 822.54"
        className={cn(sizes[size], className)}
        {...props}
      >
        {/* Icon Path */}
        <motion.path
          variants={draw ? pathVariants : {}}
          initial={draw ? "hidden" : false}
          animate={draw ? "visible" : false}
          stroke="currentColor"
          strokeWidth={10}
          className="fill-neutral-900 dark:fill-neutral-100"
          d="M612.79 783.54H227.43c-41.6 0-82.15-11.19-117.26-32.37-32.96-19.88-60.58-48.18-79.88-81.85C10.99 635.66.52 597.52.02 559.03c-.54-41 10.29-81.64 31.32-117.54l192.67-329.07c20.81-35.55 50.62-64.69 86.19-84.28C343.64 9.73 381.64 0 420.11 0s76.47 9.73 109.9 28.14c35.57 19.59 65.38 48.73 86.19 84.28l192.68 329.07c21.02 35.9 31.85 76.55 31.31 117.54-.5 38.49-10.97 76.62-30.27 110.29s-46.92 61.97-79.88 81.85c-35.11 21.18-75.65 32.37-117.26 32.37ZM396.6 213.47 203.92 542.54c-6.59 11.26-3.71 21.06-.13 27.31s10.59 13.69 23.63 13.69h385.36c13.04 0 20.05-7.45 23.63-13.69 3.58-6.25 6.46-16.05-.12-27.31L443.61 213.47c-6.52-11.14-16.38-13.47-23.5-13.47s-16.98 2.34-23.5 13.47Z"
        />

        {/* Animated Text */}
        <motion.text
          x="1050"
          y="600"
          fontSize="600"
          fontFamily="var(--font-logo)"
          fontWeight="600"
          fill="currentColor"
          variants={draw ? textVariants : {}}
          initial={draw ? "hidden" : false}
          animate={draw ? "visible" : false}
          
        >
          {appConfig.name.split(" ")[0]}
        </motion.text>
      </motion.svg>
    </div>
  );
};
