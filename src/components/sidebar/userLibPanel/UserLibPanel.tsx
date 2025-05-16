"use client";

import Button from "@/ui//buttons/Button";
import Link from "next/link";
import useScrollQuery from "@/hooks/useScrollQuery";
import { PlaylistType } from "@/types/response";
import { GoPlus } from "react-icons/go";
import Image from "@/ui//custom/Image";

import { ErrorWrapper, Modal, PlaylistForm } from "@/components";
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function UserLibPanel({ username = "" }: { username?: string }) {
  const [isPlaylistForm, setIsPlaylistForm] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
  if (!username)
    return (
      <Button
        href={`/login?callbackUrl=${pathname}${searchParams.toString() ? "?" + searchParams.toString() : ""}`}
        className="bg-gray-200 text-black rounded-lg mt-2 text-xl flex "
      >
        Sign in
      </Button>
    );

  return (
    <div className="flex flex-col w-full">
      <ErrorWrapper refetch={refetch} className="mx-auto" error={isError || !!error} message={error?.message}>
        {isPlaylistForm && (
          <Modal className="modal-container" onClose={() => setIsPlaylistForm(false)}>
            <PlaylistForm onClose={() => setIsPlaylistForm(false)} username={username} onSuccess={() => refetch()} />
          </Modal>
        )}
        <Button
          onClick={() => setIsPlaylistForm(true)}
          className="flex items-center justify-center gap-2 brightness-85"
        >
          <GoPlus className="size-7" /> New playlist
        </Button>

        <Link
          href="/myLib/likedSongs"
          className="flex gap-2 hover:bg-black-450 duration-150 rounded-lg p-2 items-center mt-4 active:bg-black"
        >
          <Image
            src="https://c4.wallpaperflare.com/wallpaper/617/416/921/heart-purple-plexus-wallpaper-preview.jpg"
            alt="Liked songs cover photo"
            className="size-12 rounded-md"
          />
          <div className="flex flex-col">
            <span className="line-clamp-1">Liked songs</span>
          </div>
        </Link>

        {playlists.map(({ id, coverPhoto, title, songs: { length: songsLength } }, index) => {
          return (
            <Link
              key={`${id}_${index}`}
              href={`/playlist/${id}`}
              className="flex gap-2 hover:bg-black-450 duration-150 rounded-lg p-2 active:bg-black"
            >
              <Image src={coverPhoto} alt="Playlist cover photo" className="size-12 rounded-md" />
              <div className="flex flex-col">
                <span className="line-clamp-1">{title}</span>
                <span className="text-gray-300 text-sm">{songsLength} songs</span>
              </div>
            </Link>
          );
        })}

        {!isFetchingNextPage && hasNextPage && <div ref={ref} />}
        {isFetchingNextPage && <div className="spinner" />}
      </ErrorWrapper>
    </div>
  );
}
