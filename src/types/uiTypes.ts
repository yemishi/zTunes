import { AnimationEventHandler, DragEventHandler, HTMLAttributes } from "react";

interface DivMotionProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onAnimationStart?: AnimationEventHandler<HTMLDivElement>;
  onDragStart?: DragEventHandler<HTMLDivElement>;
  onDrag?: DragEventHandler<HTMLDivElement>;
  onDragEnd?: DragEventHandler<HTMLDivElement>;
  reverse?: boolean;
  hidden?: boolean;
  oneSide?: boolean;
}

export type { DivMotionProps };
