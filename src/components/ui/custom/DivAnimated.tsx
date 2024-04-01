import { DivMotionProps } from "@/types/uiTypes";
import { motion } from "framer-motion";

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
  const variant = {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: oneSide ? "100%" : "-100%", opacity: 0 },
  };

  const variantReverse = {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: oneSide ? "-100%" : "100%", opacity: 0 },
  };

  return (
    <>
      {!hidden && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={reverse ? variantReverse : variant}
          transition={{
            type: "just",
          }}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}
