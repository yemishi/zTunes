"use client";

import useLike from "@/hooks/useLike";
import { FaHeart } from "react-icons/fa6";

interface PropsType extends React.HTMLAttributes<HTMLButtonElement> {
  songId: string;
}

export default function ToggleLike({
  songId,
  className,
  onClick,
  ...props
}: PropsType) {
  const { isLiked, isLoading, toggleLike } = useLike(songId);
  return (
    <button
      onClick={(e) => {
        onClick ? onClick(e) : null, toggleLike();
      }}
      {...props}
      className={`${className} ${isLoading ? "pointer-events-none" : ""}  ${
        className?.includes("size" || "h-" || "w-") ? "" : "size-12"
      } ${
        className?.includes("p-") ? "" : "p-2"
      } flex font-medium text-lg items-center`}
    >
      <FaHeart
        className={`h-full w-full duration-200 hover:opacity-70 active:scale-105 ${
          isLiked ? "text-amber-600 " : "text-white text-opacity-55"
        }`}
      />
    </button>
  );
}
