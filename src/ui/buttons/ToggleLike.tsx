"use client";

import useLike from "@/hooks/useLike";
import { cleanClasses } from "@/utils/helpers";
import { FaHeart } from "react-icons/fa6";

interface PropsType extends React.HTMLAttributes<HTMLButtonElement> {
  songId: string;
  username?: string;
}

export default function ToggleLike({ songId, className, onClick, username, ...props }: PropsType) {
  const { isLiked, isLoading, toggleLike } = useLike(songId, username);
  return (
    <button
      onClick={(e) => {
        onClick ? onClick(e) : null, toggleLike();
      }}
      {...props}
      className={`${cleanClasses(className, "flex font-medium text-lg items-center size-12 p-2")} ${
        isLoading ? "pointer-events-none" : ""
      }`}
    >
      <FaHeart
        className={`h-full w-full cursor-pointer transition-all hover:opacity-70 active:scale-105 ${
          isLiked ? "text-amber-600 " : "text-white opacity-55"
        }`}
      />
    </button>
  );
}
