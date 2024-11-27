"use client";

import { SongType } from "@/types/response";
import { RxDotsVertical } from "react-icons/rx";
import { lazy, useState } from "react";
import { useSession } from "next-auth/react";
import { usePlayerContext, useTempOverlay } from "@/context/Provider";

import Image from "../ui/custom/Image";
import Link from "next/link";
import ToggleLike from "../ui/buttons/ToggleLike";
import checkDev from "@/utils/isMobile";
import SongSkeleton from "../skeletons/SongSkeleton";
import { dateFormat } from "@/utils/formatting";

const SongDuration = lazy(() => import("../ui/custom/SongDuration"));
const SongOptions = lazy(() => import("../songOptions/songOptions"));
const AddToPlaylist = lazy(() => import("../songOptions/addToPlaylist"));

export default function SongsOrganizer({
  songs,
  asOl,
  title,
  playlistId,
  refetch,
  isLoading,
}: {
  songs: SongType[];
  asOl?: true;
  title?: string;
  isLoading?: number;
  refetch?: () => void;
  playlistId?: string;
}) {
  const { setPlayer, setCurrSong, currSong, player } = usePlayerContext();
  const [toPlaylist, setToPlaylist] = useState<{
    songSelected: { songId: string; createdAt: Date };
    coverPhoto: string;
    title: string;
  } | null>(null);

  const { data } = useSession();
  const user = data?.user;
  const turnOnPlayer = (index: number) => {
    setPlayer(songs), setCurrSong(index);
  };
  const { close, setChildren } = useTempOverlay();

  const Options = (selectedSong: SongType) => (
    <SongOptions
      refetch={refetch}
      song={selectedSong}
      playlistId={playlistId}
      onclose={close}
    />
  );

  const isMobile = checkDev();

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

      {songs.map((song, index) => {
        const {
          artistId,
          artistName,
          coverPhoto,
          name,
          id,
          urlSong,
          albumId,
          albumName,
          createdAt,
        } = song;

        return (
          <div
            onClick={() => turnOnPlayer(index)}
            className={`w-full flex font-kanit font-light items-center gap-3 px-3 py-2 hover:bg-black-400 rounded-lg active:bg-black
             hover:bg-opacity-35 duration-150 md:grid md:grid-cols-3 md:max-w-[1900px] cursor-pointer md:font-medium ${currSong === index && player?.some((song) => song.id === id)
                ? "bg-neutral-900"
                : ""
              }`}
            key={`${id}_${index}`}
          >
            <div className="flex gap-2">
              {asOl ? (
                <span className="text-lg font-mono opacity-75">
                  {index + 1}
                </span>
              ) : (
                <Image
                  src={coverPhoto}
                  className="size-12 rounded md:size-14"
                />
              )}
              <div className="flex flex-col">
                <span className="first-letter:uppercase text-lg md:text-xl ">
                  {name}
                </span>
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

            {!isMobile && (
              <Link
                href={`/album/${albumId}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xl opacity-75 hover:underline hover:underline-offset-4 hover:opacity-100 duration-150 w-max "
              >
                {albumName}
              </Link>
            )}
            <div
              onClick={(e) => e.stopPropagation()}
              className={`flex md:  md:grid-cols-3  gap-2 justify-items-end items-center ml-auto `}
            >
              {!isMobile && (
                <>
                  {playlistId && (
                    <span className="mr-3 text-lg opacity-75 ">
                      {dateFormat(createdAt)}
                    </span>
                  )}
                  <ToggleLike songId={id} />
                  <SongDuration urlSong={urlSong} rerender={songs} />

                </>
              )}
              <RxDotsVertical
                className="h-full w-6 md:w-8"
                onClick={(e) => setChildren(Options(song))}
              />
            </div>
          </div>
        );
      })}

      {toPlaylist && (
        <AddToPlaylist
          username={user?.name}
          userAvatar={user?.picture}
          options={toPlaylist}
          onclose={() => setToPlaylist(null)}
        />
      )}
    </div>
  );
}
