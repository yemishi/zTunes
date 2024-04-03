"use client"
import useScrollQuery from "@/hooks/useScrollQuery";
import SongsOrganizer from "./SongsOrganizer";
import { SongType } from "@/types/response";
import SongSkeleton from "../skeletons/SongSkeleton";

export default function SongsQueryOrganizer({
  queryKey,
  url,
  asOl,
  playlistId,
}: {
  asOl?: true;
  queryKey: string[];
  url: string;
  playlistId?: string;
}) {
  const {
    values: songs,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    ref,
    refetch,
  } = useScrollQuery<SongType>({
    queryKey,
    url,
  });

  return (
    <div className="flex flex-col">
      <SongsOrganizer
        asOl={asOl}
        isLoading={isLoading ? 10 : undefined}
        songs={songs}
        refetch={refetch}
        playlistId={playlistId}
      />

      {!isFetchingNextPage && hasNextPage && <div ref={ref} />}
      {isFetchingNextPage && <SongSkeleton />}
    </div>
  );
}
