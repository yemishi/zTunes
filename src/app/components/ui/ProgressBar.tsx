"use client";
import { HTMLAttributes, MouseEventHandler } from "react";
import { useRef } from "react";

interface RangeProps extends HTMLAttributes<HTMLInputElement> {
  currentProgress: number;
  onClick?: MouseEventHandler<HTMLDivElement>;
  vertical?: boolean;
  progressClass?: string;
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
  progressClass,
  currentProgress,
  className,
  ...props
}: RangeProps) {
  const divRef = useRef<HTMLDivElement>(null);

  return (
    <div
      onClick={onClick}
      ref={divRef}
      className={`${className ? className : ""} ${
        vertical ? "rotate-[270deg]" : ""
      } relative flex`}
    >
      <input
        style={{ color: "black" }}
        value={value}
        min={min || 0}
        max={max}
        step={step}
        type="range"
        className="appearance-none w-full bg-opacity-20 bg-white h-1 rounded-full outline-none z-10"
        {...props}
      />
      <div
        style={{
          width: Number(divRef.current?.clientWidth) * currentProgress || 0,
        }}
        className={`${progressClass ? progressClass : ""} ${
          progressClass?.includes("bg-") ? "" : "bg-white"
        }  absolute h-full rounded-full`}
      />
    </div>
  );
}
