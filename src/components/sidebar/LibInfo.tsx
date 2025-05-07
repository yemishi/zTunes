"use client";

import { useSession } from "next-auth/react";
import Button from "../ui/buttons/Button";
import Link from "next/link";
import useScrollQuery from "@/hooks/useScrollQuery";
import { PlaylistType } from "@/types/response";
import { GoPlus } from "react-icons/go";
import Image from "../ui/custom/Image";

import NewPlaylistForm from "../form/NewPlaylistForm";
import { redirect } from "next/navigation";
import { useTempOverlay } from "@/context/Provider";

export default function LibInfo() {
  const { data: session } = useSession();

  if (!session || !session.user || !session.user.name)
    return (
      <Button className="bg-gray-200 text-black rounded-lg mt-2 text-xl flex px-0 py-0">
        <Link href="/login" className="flex-1 p-2">
          Sign in
        </Link>
      </Button>
    );
  const user = session.user;
  const {
    values: playlists,
    ref,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
  } = useScrollQuery<PlaylistType>({
    queryKey: ["User playlists", user.name],
    url: `/api/playlist?authorName=${user.name}&username=${user.name}`,
  });

  if (error || isError) return redirect("404");

  const { setChildren, close: closeForm } = useTempOverlay();

  const Form = <NewPlaylistForm onclose={() => closeForm()} username={user.name} onSuccess={() => refetch()} />;

  return (
    <div className="flex flex-col w-full">
      <Button
        onClick={() => setChildren(Form)}
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
    </div>
  );
}
