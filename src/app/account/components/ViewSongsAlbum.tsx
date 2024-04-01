"use client";

import { usePlayerContext } from "@/context/Provider";
import { SongType } from "@/types/response";
import EditSong from "./songManager/EditSong";
import Input from "@/components/ui/inputs/Input";
import Button from "@/components/ui/buttons/Button";
import { useState } from "react";
import NewSong from "./songManager/NewSong";
import useScrollQuery from "@/hooks/useScrollQuery";

export default function ViewSongsAlbum({
  albumId,
  artistId,
  url,
}: {
  artistId: string;
  albumId: string;
  url: string;
}) {
  const { turnOnPlayer, currSong, player } = usePlayerContext();
  const [name, setName] = useState<string>("");
  const [isNew, setIsNew] = useState<boolean>(false);
  const {
    values: songs,
    hasNextPage,
    ref,
    isLoading,
    isFetchingNextPage,
  } = useScrollQuery<SongType>({
    queryKey: ["Songs"],
    url,
  });
  return (
    <div className="flex flex-col gap-3">
      <div
        onClick={(e) => e.stopPropagation()}
        className=" flex items-center px-3"
      >
        <Input
          label=""
          placeholder="New song name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          classNameInput="bg-transparent border-gray-300 border-b-2"
        />
        <Button
          onClick={() => setIsNew(true)}
          className="ml-auto rounded-lg text-sm text-black"
        >
          New
        </Button>
      </div>

      {songs.map((song, index) => {
        const { id, name: songName } = song;
        return (
          <div
            onClick={() => turnOnPlayer(songs, index)}
            className={`w-full flex font-kanit font-light relative items-center gap-3 px-3 py-2 hover:bg-neutral-900 hover:bg-opacity-35 overflow-hidden ${
              currSong === index && player?.some((song) => song.id === id)
                ? "bg-neutral-900"
                : ""
            }`}
            key={`${id}_${index}`}
          >
            <span className="text-lg text-white font-mono text-opacity-75">
              {index + 1}
            </span>
            <span className="first-letter:uppercase text-lg ">{songName}</span>
            <EditSong song={song} />
          </div>
        );
      })}
      {isNew && (
        <NewSong
          close={() => setIsNew(false)}
          albumId={albumId}
          artistId={artistId}
          name={name}
          setName={setName}
        />
      )}
      {!isFetchingNextPage && hasNextPage && <div ref={ref} />}
      {(isFetchingNextPage || isLoading) && <div className="spinner  " />}
    </div>
  );
}
