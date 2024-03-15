"use client";

import { SongType } from "@/types/response";
import Image from "../ui/Image";
import { RxDotsVertical } from "react-icons/rx";
import Link from "next/link";
import { lazy, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { usePlayerContext } from "@/context/Provider";
const SongOptions = lazy(() => import("../songOptions/songOptions"));
const AddToPlaylist = lazy(() => import("../songOptions/addToPlaylist"));

export default function SongsOrganizer({
  songs,
  playlistId,
  asOl,
  title,
}: {
  songs: SongType[];
  asOl?: true;
  title?: string;
  playlistId?: string;
}) {
  const { setPlayer, setCurrSong, currSong, player } = usePlayerContext();

  const [selectedSong, setSelectedSong] = useState<SongType | null>(null);
  const [toPlaylist, setToPlaylist] = useState<{
    songSelected: { songId: string; createdAt: Date };
    coverPhoto: string;
    title: string;
  } | null>(null);

  const { data } = useSession();
  const { push } = useRouter();
  const user = data?.user;
  const turnOnPlayer = (index: number) => {
    setPlayer(songs), setCurrSong(index);
  };

  return (
    <div className="w-full flex flex-col gap-2 ">
      {title && <h2 className="font-kanit text-xl ml-4">{title}</h2>}

      {songs.map((song, index) => {
        const { artistId, artistName, coverPhoto, name, id } = song;

        return (
          <div
            onClick={() => turnOnPlayer(index)}
            className={`w-full flex font-kanit font-light items-center gap-3 px-3 py-2 hover:bg-neutral-900 hover:bg-opacity-35 ${
              currSong === index && player?.some((song) => song.id === id)
                ? "bg-neutral-900"
                : ""
            }`}
            key={`${id}_${index}`}
          >
            {asOl ? (
              <span className="text-lg text-white font-mono text-opacity-75">
                {index + 1}
              </span>
            ) : (
              <Image src={coverPhoto} className="size-12 rounded" />
            )}
            <div className="flex flex-col">
              <span className="first-letter:uppercase text-lg ">{name}</span>
              <Link
                href={`/artist/${artistId}`}
                className="first-letter:uppercase text-sm text-white text-opacity-65"
              >
                {artistName}
              </Link>
            </div>

            <RxDotsVertical
              className="h-10 w-6 ml-auto"
              onClick={(e) => {
                e.stopPropagation(), setSelectedSong(song);
              }}
            />
          </div>
        );
      })}

      {selectedSong && (
        <SongOptions
          username={user?.name}
          song={selectedSong}
          playlistId={playlistId}
          toPlaylist={(
            songSelected: { songId: string; createdAt: Date },
            coverPhoto: string,
            title: string
          ) => {
            if (!user?.name) {
              push("/sign-in");
              return toast.info("You must be logged first");
            }
            setToPlaylist({ songSelected, coverPhoto, title });
            setSelectedSong(null);
          }}
          onclose={() => setSelectedSong(null)}
        />
      )}

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
