"use client";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { IoArrowBackOutline } from "react-icons/io5";

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {}

function PreviousPage({ ...props }: DivProps) {
  const { back } = useRouter();
  const hasPrevious = window.history?.length;
  return (
    <div
      {...props}
      className={`w-full ${props.className ? props.className : ""} ${
        props.className?.includes("p") ? "" : "py-4 pl-2"
      }`}
    >
      <IoArrowBackOutline
        onClick={() => (hasPrevious ? back() : null)}
        className={`size-7 text-white ${hasPrevious ? "" : "text-opacity-30"} `}
      />
    </div>
  );
}
export default memo(PreviousPage);
