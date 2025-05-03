"use client";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { IoArrowBackOutline } from "react-icons/io5";

interface DivProps extends React.HTMLAttributes<HTMLDivElement> { }

const hasPrevious = typeof window !== "undefined" && window.history?.length;

function PreviousPage({ className, ...props }: DivProps) {
  const { back } = useRouter();

  return (
    <div
      {...props}
      className={`${className ? className : ""} ${className?.includes("p") ? "" : "py-4 pl-2"
        } mr-auto`}
    >
      <IoArrowBackOutline
        onClick={() => (hasPrevious ? back() : null)}
        className={`size-7 text-white cursor-pointer hover:opacity-90 active:text-amber-600 active:opacity-100 duration-100`}
      />
    </div>
  );
}

export default memo(PreviousPage);
