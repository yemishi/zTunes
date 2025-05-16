"use client";
import { cleanClasses } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { IoArrowBackOutline } from "react-icons/io5";

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {
  isLightBg?: boolean;
}

const hasPrevious = typeof window !== "undefined" && window.history?.length;

function PreviousPage({ className = "", isLightBg, ...props }: DivProps) {
  const { back } = useRouter();

  return (
    <div {...props} className={cleanClasses(className, `mr-auto py-4 pl-2 ${isLightBg ? "text-black" : ""}`)}>
      <IoArrowBackOutline
        onClick={() => (hasPrevious ? back() : null)}
        className="size-7 cursor-pointer active:text-amber-600 transition-all"
      />
    </div>
  );
}

export default memo(PreviousPage);
