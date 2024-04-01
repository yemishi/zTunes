"use client";

import { HTMLAttributes, useEffect, useRef, useState } from "react";

interface DivProps extends HTMLAttributes<HTMLDivElement> {}

export default function ExpandableText({ children, ...props }: DivProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isOverflown, setIsOverflown] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const contentHeight = contentRef.current.clientHeight;
    const lineHeight = parseFloat(
      window.getComputedStyle(contentRef.current).lineHeight
    );
    const numberOfLines = Math.ceil(contentHeight / lineHeight);
    setIsOverflown(numberOfLines > 3);
    setIsExpanded(numberOfLines < 3);
  }, [children]);

  const { className } = props;
  const defaultFont = className?.includes("font") ? "" : "font-light";
  const defaultColor = className?.includes("text-")
    ? ""
    : "text-gray-300  text-xs sm:text-sm md:text-white lg:text-lg md:!leading-6 ";

  return (
    <div {...props}>
      <p
        ref={contentRef}
        className={`${
          !isExpanded ? "line-clamp-3 " : ""
        } ${defaultFont} ${defaultColor}  max-w-[640px] `}
      >
        {children}
      </p>

      {isOverflown && (
        <button
          className="md:font-bold font-semibold"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
}
