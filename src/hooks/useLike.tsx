"use client";

import { ErrorType } from "@/types/response";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function useLike(songId: string, username?: string) {
  const queryClient = useQueryClient();
  const likeQueryKey = ["likedSong", songId, username];

  const { data: isLiked = false, isLoading } = useQuery({
    queryKey: likeQueryKey,
    queryFn: async () => {
      const res = await fetch(`/api/song/likedSong?username=${username}&songId=${songId}`);
      return await res.json();
    },
    enabled: !!username,
  });

  const toggleLike = async () => {
    const optimisticValue = !isLiked;
    queryClient.setQueryData(likeQueryKey, optimisticValue);

    const data: ErrorType = await fetch(`/api/song/likedSong`, {
      method: "PATCH",
      body: JSON.stringify({ songId, username }),
    }).then((res) => res.json());

    if (data.error) {
      queryClient.setQueryData(likeQueryKey, isLiked);
      return;
    }

    queryClient.invalidateQueries({ queryKey: likeQueryKey });
  };

  return {
    toggleLike,
    isLiked,
    isLoading,
  };
}
