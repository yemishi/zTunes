"use client";
import useScrollQuery from "@/hooks/useScrollQuery";
import SongsOrganizer from "./SongsOrganizer";
import { SongType } from "@/types/response";
import SongSkeleton from "../skeletons/SongSkeleton";
import AddSongToPlaylist from "@/app/playlist/[playlistId]/AddSongToPlaylist";
import { useTempOverlay } from "@/context/Provider";
import Button from "@/ui/buttons/Button";
import ErrorWrapper from "../errorWrapper/ErrorWrapper";

export default function SongsQueryOrganizer({
  queryKey,
  url,
  asOl,
  playlistId,
  username,
  isOwner,
}: {
  asOl?: true;
  queryKey: string[];
  url: string;
  playlistId?: string;
  username?: string;
  isOwner?: boolean;
}) {
  const {
    values: songs,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    ref,
    error,
    refetch,
    isError,
  } = useScrollQuery<SongType>({
    queryKey,
    url,
  });

  const { setChildren, close } = useTempOverlay();
  const addSong = () =>
    setChildren(
      <AddSongToPlaylist
        refetch={refetch}
        onClose={close}
        playlistId={playlistId as string}
        username={username as string}
      />
    );
  return (
    <div className="flex flex-col">
      {isOwner && (
        <Button onClick={addSong} className="mr-auto ml-3 my-2 rounded-md">
          Add song
        </Button>
      )}

      <SongsOrganizer
        asOl={asOl}
        isLoading={isLoading ? 10 : undefined}
        songs={songs}
        refetch={refetch}
        playlistId={playlistId}
      />
      {isError && <ErrorWrapper className="ml-2 mt-2" error={!!error} message={error.message} />}
      {!isError && (
        <>
          {!isFetchingNextPage && hasNextPage && <div ref={ref} />}
          {isFetchingNextPage && <SongSkeleton />}
        </>
      )}
    </div>
  );
}
