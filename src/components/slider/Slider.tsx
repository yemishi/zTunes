"use client";
import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { DivMotionProps } from "@/types/uiTypes";
import { animate, motion, useMotionValue } from "framer-motion";
import { cleanClasses } from "@/utils/helpers";

interface CustomBreakPoints {
  [key: number]: { sliderPerView?: number | false };
}

interface PropsType extends DivMotionProps {
  customBreakPoints?: CustomBreakPoints;
  children: React.ReactNode[];
  persistentDrag?: true;
}

export default function Slider({
  onAnimationStart,
  onDragStart,
  onDrag,
  onDragEnd,
  customBreakPoints,
  children,
  ...props
}: PropsType) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);

  const { className = "", ...rest } = props;

  const [rangeLeft, setRangeLeft] = useState(0);
  const [sliderPerView, setSliderPerView] = useState<number>(children.length);
  const [isDraggable, setIsDraggable] = useState<boolean>(false);

  const breakPoints: { [key: number]: number } = {
    1024: 2,
    1280: 3,
    1600: 4,
    1850: 5,
    2160: 6,
  };

  const x = useMotionValue(0);

  const updateSliderConfig = useCallback(() => {
    const width = window.innerWidth;
    if (width <= 768) {
      setIsDraggable(true);
      setSliderPerView(children.length);
      return;
    }
    let matched = children.length;

    for (const point in breakPoints) {
      if (width <= parseInt(point)) {
        matched = breakPoints[parseInt(point)];
        break;
      }
    }
    animate(x, 0, { duration: 0.4 });
    setIsDraggable(false);
    setSliderPerView(matched);
  }, [children]);

  const calcRange = useCallback(() => {
    if (!slidesRef.current || !sliderRef.current) return;
    const sliderWidth = sliderRef.current.clientWidth;
    const slides = Array.from(slidesRef.current.children);
    const totalSlidesWidth = slides.reduce((acc, slide) => acc + (slide as HTMLElement).offsetWidth, 0);

    setRangeLeft(Math.max(0, totalSlidesWidth - sliderWidth + children.length * 15 + 16));
  }, [children.length]);

  useEffect(() => {
    updateSliderConfig();
    calcRange();
  }, [updateSliderConfig, calcRange]);

  useEffect(() => {
    const handleResize = () => {
      clearTimeout((handleResize as any)._timeout);
      (handleResize as any)._timeout = setTimeout(() => {
        updateSliderConfig();
        calcRange();
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout((handleResize as any)._timeout);
    };
  }, [updateSliderConfig, calcRange]);

  return (
    <div ref={sliderRef} className={`${!isDraggable ? "w-full" : "w-screen"} overflow-hidden`}>
      <motion.div
        ref={slidesRef}
        drag={isDraggable ? "x" : false}
        dragConstraints={{
          right: 0,
          left: rangeLeft > 0 ? -rangeLeft : 0,
        }}
        style={{ x }}
        dragElastic={0.2}
        dragTransition={{ bounceDamping: 18 }}
        className={cleanClasses(className, "w-max lg::w-full flex flex-row gap-4")}
        {...rest}
      >
        {React.Children.toArray(children).slice(0, sliderPerView || children.length)}
      </motion.div>
    </div>
  );
}
