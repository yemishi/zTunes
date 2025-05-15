"use client";

import { ErrorType } from "@/types/response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

export default function useLike(songId: string, username?: string) {
  const [isLiked, setIsLiked] = useState(false);
  const queryClient = useQueryClient();

  const fetchData = async () => {
    if (!username) return;
    const data = await fetch(`/api/song/likedSong?username=${username}&songId=${songId}`).then((res) => res.json());
    setIsLiked(data);
  };
  const { isLoading } = useQuery({
    queryKey: ["likedSong", songId, username],
    queryFn: async () => await fetchData(),
  });

  const toggleLike = async () => {
    const optimisticValue = !isLiked;
    queryClient.setQueryData(["likedSong", songId, username], optimisticValue);

    const data: ErrorType = await fetch(`/api/song/likedSong`, {
      method: "PATCH",
      body: JSON.stringify({ songId, username }),
    }).then((res) => res.json());

    if (data.error) {
      queryClient.setQueryData(["likedSong", songId, username], isLiked);
      return toast.error(data.message);
    }

    queryClient.refetchQueries({ queryKey: ["likedSong", songId, username] });
  };
  return {
    toggleLike,
    isLiked,
    isLoading,
  };
}
