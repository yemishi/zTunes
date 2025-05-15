"use client";
import useScrollQuery from "@/hooks/useScrollQuery";
import SongsOrganizer from "../SongsGrid";
import { SongType } from "@/types/response";
import SongSkeleton from "../../skeletons/SongSkeleton";
import AddSongToPlaylist from "@/components/songsGrid/songsGridQuery/addSongToPlaylist/AddSongToPlaylist";
import Button from "@/ui/buttons/Button";
import ErrorWrapper from "../../errorWrapper/ErrorWrapper";
import { useState } from "react";
import Modal from "../../modal/Modal";

export default function SongsGridQuery({
  queryKey,
  url,
  asOl,
  playlistId,
  username,
  isOwner,
  isScrollQuery = true,
}: {
  asOl?: true;
  queryKey: string[];
  url: string;
  playlistId?: string;
  isScrollQuery?: boolean;
  username?: string;
  isOwner?: boolean;
}) {
  const {
    values: songs,
    isFetchingNextPage,
    hasNextPage,
    ref,
    error,
    refetch,
    fetchNextPage,
    isError,
    isLoading,
  } = useScrollQuery<SongType>({
    queryKey,
    url,
  });

  const [isModal, setIsModal] = useState(false);
  const closeModal = () => setIsModal(false);
  return (
    <div className="flex flex-col">
      {isModal && (
        <Modal className="mx-auto my-auto" onClose={closeModal}>
          <AddSongToPlaylist
            refetch={refetch}
            onClose={closeModal}
            playlistId={playlistId as string}
            username={username as string}
          />
        </Modal>
      )}
      {isOwner && (
        <Button onClick={() => setIsModal(true)} className="mr-auto ml-3 my-2 rounded-md">
          Add song
        </Button>
      )}

      <SongsOrganizer
        asOl={asOl}
        songs={songs}
        refetch={refetch}
        isLoading={isLoading ? 5 : undefined}
        playlistId={playlistId}
        username={username}
      />
      {isError && <ErrorWrapper className="ml-2 mt-2" error={!!error} message={error.message} />}
      {!isError && (
        <>
          {!isFetchingNextPage &&
            hasNextPage &&
            (isScrollQuery ? (
              <div ref={ref} />
            ) : (
              <Button
                onClick={() => fetchNextPage()}
                className="self-center mt-auto my-4 rounded-md bg-white font-semibold"
              >
                More
              </Button>
            ))}
          {isFetchingNextPage && <SongSkeleton />}
        </>
      )}
    </div>
  );
}
