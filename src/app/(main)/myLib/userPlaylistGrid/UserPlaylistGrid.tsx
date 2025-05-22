"use client";

import { Card, ErrorWrapper } from "@/components";
import { useScrollQuery } from "@/hooks";
import { PlaylistType } from "@/types/response";

export default function UserPlaylistGrid({ username }: { username?: string }) {
  if (!username) return;
  const {
    values: playlists,
    ref,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
  } = useScrollQuery<PlaylistType>({
    queryKey: ["User playlists", username],
    url: `/api/playlist?authorName=${username}&username=${username}`,
  });

  return (
    <ErrorWrapper refetch={refetch} className="mx-auto" error={isError || !!error} message={error?.message}>
      {playlists.map((item, index) => {
        const { coverPhoto, id, title, officialCategories } = item;

        return (
          <Card
            key={`${id}/${index}`}
            coverPhoto={coverPhoto}
            title={title}
            url={`/playlist/${id}`}
            isOfficial={!!officialCategories.length}
          />
        );
      })}
      {!isFetchingNextPage && hasNextPage && <div ref={ref} />}
      {isFetchingNextPage && <div className="spinner" />}
    </ErrorWrapper>
  );
}
