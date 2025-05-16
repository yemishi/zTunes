"use client";
import { DivMotionProps } from "@/types/uiTypes";
import { motion } from "framer-motion";
import { useMemo } from "react";

export default function DivAnimated({
  onAnimationStart,
  onDragStart,
  onDrag,
  onDragEnd,
  children,
  reverse,
  hidden,
  oneSide,
  ...props
}: DivMotionProps) {
  const variants = useMemo(() => {
    const isReversed = reverse ? -1 : 1;
    return {
      initial: { x: `${100 * isReversed}%`, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: `${(oneSide ? 100 : -100) * isReversed}%`, opacity: 0 },
    };
  }, [reverse, oneSide]);
  return !hidden ? (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ type: "just" }}
      {...props}
    >
      {children}
    </motion.div>
  ) : null;
}

DivAnimated.displayName = "DivAnimated";
