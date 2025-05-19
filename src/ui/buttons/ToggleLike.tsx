"use client";

import useLike from "@/hooks/useLike";
import { cleanClasses } from "@/utils/helpers";
import { FaHeart } from "react-icons/fa6";
import { BiSolidLogInCircle } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PropsType extends React.HTMLAttributes<HTMLButtonElement> {
  songId: string;
  username?: string;
}

export default function ToggleLike({ songId, className, onClick: extraFunction, username, ...props }: PropsType) {
  const { isLiked, isLoading, toggleLike } = useLike(songId, username);
  const [isLogin, setIsLogin] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as HTMLElement;
      if (isLogin && ref.current && !ref.current.contains(target)) {
        setIsLogin(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLogin]);
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (extraFunction) extraFunction(e);
    if (!username) {
      setIsLogin(true);
      return;
    }
    toggleLike();
  };
  return (
    <button
      ref={ref}
      onClick={onClick}
      {...props}
      className={`${cleanClasses(className, "flex font-medium text-lg items-center  p-2  relative")} ${
        isLoading ? "pointer-events-none" : ""
      }`}
    >
      {isLogin ? (
        <Link href={`/login?callbackUrl=${pathname}${searchParams.toString() ? "?" + searchParams.toString() : ""}`}>
          <BiSolidLogInCircle className="size-8 hover:brightness-90 active:scale-90 active:brightness-125 transition-all cursor-pointer" />
        </Link>
      ) : (
        <FaHeart
          className={` cursor-pointer transition-all hover:opacity-70 size-8  active:scale-105 ${
            isLiked ? "text-amber-600 " : "text-white opacity-55"
          }`}
        />
      )}
    </button>
  );
}
