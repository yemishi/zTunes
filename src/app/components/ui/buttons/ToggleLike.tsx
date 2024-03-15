"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaHeart } from "react-icons/fa6";

import { toast } from "react-toastify";

interface PropsType extends React.HTMLAttributes<HTMLButtonElement> {
  setIsLiked: React.Dispatch<React.SetStateAction<boolean>>;
  isLiked: boolean;
  songId: string;
}

export default function ToggleLike({
  songId,
  isLiked,
  setIsLiked,
  className,
  ...props
}: PropsType) {
  const { data: session } = useSession();
  const username = session?.user.name;
  const { push, refresh } = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return setIsLiked(false);
      const data = await fetch(
        `/api/song/likedSong?username=${username}&songId=${songId}`
      ).then((res) => res.json());
      setIsLiked(data);
    };
    fetchData();
  }, [songId]);

  const toggleLike = async () => {
    if (!username) {
      push("/sign-in");
      return toast.info("you must be logged first");
    }
    setIsLiked((oldValue) => !oldValue);

    const body = {
      songId,
      username,
    };
    await fetch(`/api/song/likedSong`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
    refresh();
  };
  return (
    <button
      onClick={toggleLike}
      {...props}
      className={`${className} ${
        className?.includes("size" || "h-" || "w-") ? "" : "size-12"
      } ${
        className?.includes("p-") ? "" : "p-2"
      } flex font-medium text-lg items-center`}
    >
      <FaHeart
        className={`h-full w-full duration-200 ${
          isLiked ? "text-amber-500 " : "text-white text-opacity-55"
        }`}
      />
    </button>
  );
}
