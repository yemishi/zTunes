"use client";

import { ErrorType } from "@/types/response";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function useLike(songId: string, username?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { refresh, push } = useRouter();

  useEffect(() => {
    if (!username) return;
    const fetchData = async () => {
      setIsLoading(true);
      const data: boolean = await fetch(`/api/song/likedSong?username=${username}&songId=${songId}`).then((res) =>
        res.json()
      );
      setIsLiked(data), setIsLoading(false);
    };
    fetchData();
  }, [songId]);

  const toggleLike = async () => {
    if (!username) return push("/login");
    setIsLoading(true), setIsLiked(!isLiked);
    const data: ErrorType = await fetch(`/api/song/likedSong`, {
      method: "PATCH",
      body: JSON.stringify({ songId, username }),
    }).then((res) => res.json());
    if (data.error) return toast.error(data.message), setIsLoading(false), setIsLiked(!isLiked);
    return refresh(), setIsLoading(false);
  };

  return {
    toggleLike,
    isLiked,
    isLoading,
  };
}
