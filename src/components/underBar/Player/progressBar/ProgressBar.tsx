"use client";
import { cleanClasses } from "@/utils/helpers";
import { HTMLAttributes, MouseEventHandler } from "react";
import { useRef } from "react";

interface RangeProps extends HTMLAttributes<HTMLInputElement> {
  currentProgress: number;
  onClick?: MouseEventHandler<HTMLDivElement>;
  vertical?: boolean;
  classContainer?: string;
  value?: number;
  max?: number;
  min?: number;
  step?: number;
}

export default function ProgressBar({
  value,
  onClick,
  max,
  min,
  step,
  vertical,
  classContainer,
  currentProgress,
  ...props
}: RangeProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const { className = "", ...rest } = props;
  return (
    <div
      onClick={onClick}
      ref={divRef}
      className={`${classContainer ? classContainer : ""} ${
        vertical ? "rotate-[270deg]" : ""
      } flex items-center relative`}
    >
      <input
        value={value}
        min={min || 0}
        max={max}
        step={step}
        type="range"
        className={`${className} bg-white/20 cursor-pointer appearance-none w-full h-1 rounded-full outline-none z-10`}
        {...rest}
      />
      <div
        style={{
          width: Number(divRef.current?.clientWidth) * currentProgress || 0,
        }}
        className={cleanClasses(className, "bg-white absolute h-1 rounded-full ")}
      />
    </div>
  );
}
