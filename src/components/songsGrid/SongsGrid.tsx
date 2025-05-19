"use client";

import { SongType } from "@/types/response";
import { usePlayerContext } from "@/context/Provider";

import { Image, ToggleLike } from "@/ui";
import Link from "next/link";
import SongSkeleton from "../skeletons/SongSkeleton";
import { dateFormat } from "@/utils/formatting";
import { getFormattedDuration } from "@/utils/helpers";

import SongOptions from "../songOptions/songOptions";

export default function SongsGrid({
  songs,
  asOl,
  title,
  playlistId,
  refetch,
  username,
  isOwner,
  isLoading,
}: {
  songs: SongType[];
  username?: string;
  asOl?: true;
  title?: string;
  isLoading?: number;
  refetch?: () => void;
  isOwner?: boolean;
  playlistId?: string;
}) {
  const { setPlayer, setCurrSong, currSong, player } = usePlayerContext();

  const turnOnPlayer = (index: number) => {
    setPlayer(songs), setCurrSong(index);
  };

  if (isLoading)
    return (
      <>
        {Array.from({ length: isLoading }).map((_, index) => (
          <SongSkeleton key={index} />
        ))}
      </>
    );

  return (
    <div className="w-full flex flex-col gap-2">
      {title && <h2 className="font-kanit text-xl ml-4">{title}</h2>}

      {songs
        .sort((a, b) => a.name.trim().localeCompare(b.name.trim()))
        .map((song, index) => {
          const { artistId, artistName, coverPhoto, name, id, createdAt, track, album } = song;

          return (
            <div
              onClick={() => turnOnPlayer(index)}
              className={`w-full flex font-kanit font-light items-center gap-3 px-3 py-2 hover:bg-black-400 rounded-lg active:bg-black
               duration-150 md:grid md:grid-cols-3 md:max-w-[1900px] cursor-pointer md:font-medium ${
                 currSong === index && player?.some((song) => song.id === id) ? "bg-neutral-900" : ""
               }`}
              key={`${id}_${index}`}
            >
              <div className="flex gap-2">
                {asOl ? (
                  <span className="text-lg font-mono opacity-75">{index + 1}</span>
                ) : (
                  <Image src={coverPhoto} className="size-12 rounded md:size-14" />
                )}
                <div className="flex flex-col">
                  <span className="first-letter:uppercase text-lg md:text-xl">{name}</span>
                  <Link
                    href={`/artist/${artistId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="first-letter:uppercase text-sm md:text-base opacity-75 hover:underline hover:underline-offset-4 hover:opacity-100
                   duration-150 "
                  >
                    {artistName}
                  </Link>
                </div>
              </div>

              <Link
                href={`/album/${album.id}`}
                onClick={(e) => e.stopPropagation()}
                className="hidden md:block text-xl opacity-75 hover:underline hover:underline-offset-4 hover:opacity-100 duration-150 w-max "
              >
                {album.name}
              </Link>
              <div onClick={(e) => e.stopPropagation()} className={`flex gap-2 justify-items-end items-center ml-auto`}>
                {playlistId && <span className="md:mr-3 md:text-lg max-md:text-orange-300">{dateFormat(createdAt)}</span>}
                <ToggleLike className="hidden md:flex" songId={id} username={username} />
                <span className="text-lg min-w-12 hidden md:flex">{getFormattedDuration(track.duration)}</span>

                <SongOptions
                  isOwner={isOwner}
                  refetch={refetch}
                  song={song}
                  playlistId={playlistId}
                  username={username}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
}
