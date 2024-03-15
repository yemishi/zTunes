"use client";
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { DivMotionProps } from "@/types/uiTypes";
import { motion } from "framer-motion";
import isMobile from "@/app/utils/isMobile";

interface CustomBreakPoints {
  1024: { sliderPerView?: number | false };
  1280: { sliderPerView?: number | false };
  1536: { sliderPerView?: number | false };
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
  persistentDrag,
  children,
  ...props
}: PropsType) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);

  const [rangeLeft, setRangeLeft] = useState<number>(0);
  const [sliderPerView, setSliderPerView] = useState<number | false>();

  const isDisableDrag = persistentDrag === undefined && !isMobile();

  const breakPoints = useMemo(() => {
    return {
      "1024": { sliderPerView: isDisableDrag && 4 },
      "1280": { sliderPerView: isDisableDrag && 5 },
      "1536": { sliderPerView: isDisableDrag && 6 },
    };
  }, [isDisableDrag]);

  const checkMediaQuery = (size: string) => {
    return window.matchMedia(`(max-width: ${size}px)`).matches;
  };

  const updateSliderPerView = useCallback(() => {
    const foundSize = Object.entries(customBreakPoints || breakPoints).find(
      ([point, obj]) => {
        const { sliderPerView } = obj;
        return checkMediaQuery(point) && sliderPerView;
      }
    );
    if (foundSize && isDisableDrag)
      setSliderPerView(foundSize[1].sliderPerView);
    else setSliderPerView(false);
  }, [customBreakPoints, isDisableDrag]);

  const calcRange = useCallback(() => {
    if (!slidesRef.current) return;
    const sliderWidth = sliderRef.current?.clientWidth;
    const slidesNode = Array.from(slidesRef.current.children);
    const widthArr = slidesNode.map((e) => e.clientWidth);
    const slidesWidth = widthArr.reduce((acc, cur) => acc + cur);

    setRangeLeft(
      slidesWidth - (sliderWidth || 0) + children.length * 15 + 16 //16 bcuz gap-4
    );
  }, [children, sliderRef.current?.clientWidth]);

  useEffect(() => {
    calcRange();
    updateSliderPerView();
  }, [calcRange, updateSliderPerView]);

  useEffect(() => {
    const handleResize = () => {
      updateSliderPerView();
      calcRange();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [calcRange, updateSliderPerView]);
  const isDrag =
    (Number(slidesRef.current?.clientWidth) + 16 || 0) >
      (sliderRef.current?.clientWidth || 0) && !isDisableDrag;

  return (
    <div ref={sliderRef} className={!isDrag ? "w-full" : "w-screen"}>
      <motion.div
        ref={slidesRef}
        drag={isDrag ? "x" : false}
        dragConstraints={{
          right: 0,
          left: -rangeLeft,
        }}
        dragElastic={0.2}
        dragTransition={{ bounceDamping: 18 }}
        className={` ${props.className ? props.className : ""} ${
          isDisableDrag ? "w-full" : "w-max"
        } flex flex-row gap-4 `}
        {...props}
      >
        {React.Children.toArray(children).slice(
          0,
          sliderPerView || children.length
        )}
      </motion.div>
    </div>
  );
}
