"use client";

import { SongType } from "@/types/response";
import { RxDotsVertical } from "react-icons/rx";
import { lazy, useState } from "react";
import { useSession } from "next-auth/react";
import { usePlayerContext } from "@/context/Provider";

import { Image, ToggleLike } from "@/ui";
import Link from "next/link";
import SongSkeleton from "../skeletons/SongSkeleton";
import { dateFormat } from "@/utils/formatting";
import Modal from "../modal/Modal";
import { getFormattedDuration } from "@/utils/helpers";

const SongOptions = lazy(() => import("../songOptions/songOptions"));
const AddToPlaylist = lazy(() => import("../songOptions/addToPlaylist"));

export default function SongsGrid({
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
  const [isModal, setIsModal] = useState(false);
  const closeModal = () => setIsModal(false);

  const { data } = useSession();
  const user = data?.user;
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
          const { artistId, artistName, coverPhoto, name, id, albumId, albumName, createdAt, track } = song;

          return (
            <div
              onClick={() => turnOnPlayer(index)}
              className={`w-full flex font-kanit font-light items-center gap-3 px-3 py-2 hover:bg-black-400 rounded-lg active:bg-black
             hover:bg-opacity-35 duration-150 md:grid md:grid-cols-3 md:max-w-[1900px] cursor-pointer md:font-medium ${
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
                  <span className="first-letter:uppercase text-lg md:text-xl ">{name}</span>
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
                href={`/album/${albumId}`}
                onClick={(e) => e.stopPropagation()}
                className="hidden md:block text-xl opacity-75 hover:underline hover:underline-offset-4 hover:opacity-100 duration-150 w-max "
              >
                {albumName}
              </Link>
              <div
                onClick={(e) => e.stopPropagation()}
                className={`flex md:grid-cols-3 gap-2 justify-items-end items-center ml-auto `}
              >
                {playlistId && <span className="mr-3 text-lg opacity-75">{dateFormat(createdAt)}</span>}
                <div className="hidden md:flex gap-1 items-center">
                  <ToggleLike songId={id} />
                  <span className="text-lg">{getFormattedDuration(track.duration)}</span>
                </div>

                {isModal && (
                  <Modal className="modal-container" onClose={closeModal}>
                    <SongOptions refetch={refetch} song={song} playlistId={playlistId} onclose={closeModal} />
                  </Modal>
                )}
                <RxDotsVertical className="h-full w-6 md:w-8" onClick={() => setIsModal(true)} />
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
