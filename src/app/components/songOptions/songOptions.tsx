"use client";

import { SongType } from "@/types/response";
import { useState } from "react";
import { RiAlbumLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { MdPlaylistAdd } from "react-icons/md";
import { CgPlayListRemove } from "react-icons/cg";
import { toast } from "react-toastify";
import { removeFromPlaylist } from "@/app/utils/fnc";

import Image from "../ui/Image";
import Link from "next/link";
import Button from "../ui/Button";
import ToggleLike from "../ui/ToggleLike";

export default function SongOptions({
  song,
  onclose,
  toPlaylist,
  playlistId,
}: {
  song: SongType;
  onclose: () => void;
  username: string | undefined;
  playlistId?: string;
  toPlaylist: (
    songSelected: { songId: string; createdAt: Date },
    title: string,
    coverPhoto: string
  ) => void;
}) {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const { refresh } = useRouter();

  const { albumId, artistId, artistName, coverPhoto, name, id, createdAt } =
    song;

  const selected = { songId: id, createdAt };
  const toRemove = () => {
    removeFromPlaylist(selected, playlistId as string).then((res) => {
      if (res.error) return toast.error(res.message);
      toast.success(res.message);
      refresh();
      onclose();
    });
  };

  return (
    <div className="fixed h-full w-full font-kanit top-0 left-0 backdrop-blur-lg backdrop-brightness-50 p-4 pt-20 flex flex-col z-10">
      <div className="flex gap-5 mb-7">
        <Image src={coverPhoto} className="size-16" />
        <span className="flex flex-col">
          <span className="text-lg first-letter:uppercase">{name}</span>
          <span className="text-white text-opacity-75 text-sm">
            {artistName}
          </span>
        </span>
      </div>

      <div className="flex gap-3 w-max font-medium text-lg items-center">
        <ToggleLike
          className="size-6 p-0"
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          songId={id}
        />
        {isLiked ? "Liked" : "Like"}
      </div>

      <Link
        href={`/artist/${artistId}`}
        onClick={onclose}
        className="flex gap-3 py-2 w-max font-medium text-lg items-center"
      >
        <BsFillPersonPlusFill className="size-6" />
        See artist
      </Link>

      <Link
        href={`/album/${albumId}`}
        onClick={onclose}
        className="flex gap-3 py-2 w-max font-medium text-lg items-center"
      >
        <RiAlbumLine className="size-6" />
        See album
      </Link>

      <button
        onClick={() => toPlaylist(selected, coverPhoto, name)}
        className="flex gap-3 py-2 w-max font-medium text-lg items-center"
      >
        <MdPlaylistAdd className="size-6 duration-200" />
        Add to a playlist
      </button>

      {playlistId && (
        <button
          onClick={toRemove}
          className="flex gap-3 py-2 w-max font-medium text-lg items-center"
        >
          <CgPlayListRemove className="size-6 duration-200" />
          Remove from playlist
        </button>
      )}

      <Button onClick={onclose} className="mt-auto mb-14">
        Close
      </Button>
    </div>
  );
}
