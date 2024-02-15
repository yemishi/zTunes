import { motion } from "framer-motion";
import {
  AnimationEventHandler,
  DragEventHandler,
  ReactNode,
  HTMLAttributes,
} from "react";

interface DivProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onAnimationStart?: AnimationEventHandler<HTMLDivElement>;
  onAnimationEnd?: AnimationEventHandler<HTMLDivElement>;
  onDragStart?: DragEventHandler<HTMLDivElement>;
  onDrag?: DragEventHandler<HTMLDivElement>;
  onDragEnd?: DragEventHandler<HTMLDivElement>;
  onTap?: () => void;
  reverse?: boolean;
  hidden?: boolean;
}

export default function DivAnimated({
  onAnimationStart,
  onAnimationEnd,
  onDragStart,
  onDrag,
  onDragEnd,
  onTap,
  children,
  reverse,
  hidden,
  ...props
}: DivProps) {
  const variant = {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  };

  const variantReverse = {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
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
