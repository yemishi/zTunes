"use client";
import { useRef, useState, useEffect } from "react";
import { DivMotionProps } from "@/types/uiTypes";
import { motion } from "framer-motion";

export default function Slider({
  onAnimationStart,
  onDragStart,
  onDrag,
  onDragEnd,
  children,
  ...props
}: DivMotionProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const [rangeLeft, setRangeLeft] = useState<number>(0);
  useEffect(() => {
    const calcRange = () => {
      if (!slidesRef.current) return;
      const sliderWidth = sliderRef.current?.clientWidth;
      const slidesNode = Array.from(slidesRef.current.children);
      const widthArr = slidesNode.map((e) => e.clientWidth);
      const slidesWidth = widthArr.reduce((acc, cur) => acc + cur);
      setRangeLeft(
        slidesWidth - (sliderWidth || 0) + children.length * 15 + 16 //16 bcuz gap-4
      );
    };
    calcRange();
    window.addEventListener("resize", calcRange);
    return () => {
      window.removeEventListener("resize", calcRange);
    };
  }, [slidesRef, sliderRef]);

  const isDrag =
    (Number(slidesRef.current?.clientWidth) + 16 || 0) >
    (sliderRef.current?.clientWidth || 0);

  return (
    <div ref={sliderRef} className="w-screen">
      <motion.div
        ref={slidesRef}
        drag={isDrag ? "x" : false}
        dragPropagation
        dragConstraints={{
          right: 0,
          left: -rangeLeft,
        }}
        dragElastic={0.2}
        dragTransition={{ bounceDamping: 18 }}
        className={` ${
          props.className ? props.className : ""
        } w-max flex flex-row gap-4`}
        {...props}
      >
        {children}
      </motion.div>
    </div>
  );
}
