"use client";

import { motion } from "motion/react";

import { Logo } from "@/components/logo";
import { useIsMobile } from "@/hooks/use-mobile";
import { ModeToggle } from "./mode-toggle";
import { Socials } from "./socials";
import { TransitionLink } from "./utils/link";

const LOGO_WRAPPER_VARIANTS = {
  center: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100%",
  },
  topLeft: {
    top: 0,
    left: 0,
    right: 0,
    bottom: "auto",
    height: "auto",
  },
};

export const Header = ({ transition }: { transition: boolean }) => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      variants={LOGO_WRAPPER_VARIANTS}
      initial="center"
      animate={transition ? "topLeft" : "center"}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
      className="absolute z-40 flex items-center justify-center"
    >
      <div className="relative max-w-7xl size-full">
        {transition ? (
          <motion.div
            layoutId="logo"
            className="absolute z-110 left-5"
            animate={{
              top: 32,
            }}
          >
            <TransitionLink href="/">
              <Logo size="sm" />
            </TransitionLink>
          </motion.div>
        ) : (
          <motion.div
            layoutId="logo"
            className="absolute z-110 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Logo size={isMobile ? "lg" : "xl"} draw />
          </motion.div>
        )}

        <motion.div
          initial={{
            top: 28,
            right: -43,
            opacity: 0,
          }}
          animate={
            transition
              ? {
                  top: 28,
                  right: 20,
                  opacity: 1,
                }
              : {
                  top: 28,
                  right: -43,
                  opacity: 0,
                }
          }
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
          className="absolute z-110 flex items-center gap-x-4"
        >
          <Socials className="items-center gap-x-1" />

          <ModeToggle />
        </motion.div>
      </div>
    </motion.div>
  );
};
