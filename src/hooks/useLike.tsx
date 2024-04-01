"use client";

import { ErrorType } from "@/types/response";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function useLike(songId: string) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>();

  const { refresh, push } = useRouter();
  const { data: session } = useSession();

  const username = session?.user.name;

  useEffect(() => {
    const fetchData = async () => {
      if (!username) return setIsLiked(false), setIsLoading(false);
      const data: boolean = await fetch(
        `/api/song/likedSong?username=${username}&songId=${songId}`
      ).then((res) => res.json());
      setIsLiked(data), setIsLoading(false);
    };
    fetchData();
  }, [songId]);

  const toggleLike = async () => {
    if (!username) return push("/sign-in");
    setIsLoading(true), setIsLiked(!isLiked);
    const data: ErrorType = await fetch(`/api/song/likedSong`, {
      method: "PATCH",
      body: JSON.stringify({ songId, username }),
    }).then((res) => res.json());
    if (data.error)
      return (
        toast.error(data.message), setIsLoading(false), setIsLiked(!isLiked)
      );
    return refresh(), setIsLoading(false);
  };

  return {
    toggleLike,
    isLiked,
    isLoading,
  };
}
