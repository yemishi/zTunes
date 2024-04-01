"use client";
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
  const { className, ...rest } = props;
  const defaultBg = className?.includes("bg-") ? "" : "bg-white";
  return (
    <div
      onClick={onClick}
      ref={divRef}
      className={`${classContainer ? classContainer : ""} ${
        vertical ? "rotate-[270deg]" : ""
      } relative flex items-center `}
    >
      <input
        value={value}
        min={min || 0}
        max={max}
        step={step}
        type="range"
        className={`${
          className ? className : ""
        } bg-white cursor-pointer appearance-none w-full bg-opacity-20 h-1 rounded-full outline-none z-10`}
        {...rest}
      />
      <div
        style={{
          width: Number(divRef.current?.clientWidth) * currentProgress || 0,
        }}
        className={`${
          className ? className : ""
        } ${defaultBg} absolute h-1 rounded-full  `}
      />
    </div>
  );
}
