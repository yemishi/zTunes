"use client";

import { Image } from "@/ui";

import { SearchType } from "../page";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePlayerContext } from "@/context/Provider";
import { FaCheck, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

type UrlValues = "album" | "artist" | "user" | "playlist";

export default function CardSearch({
  data,
  username,
  isHistoric,
  refetch,
  isLoading: loadingProp,
  playlistId,
}: {
  username: string;
  data: SearchType;
  refetch?: () => void;
  isLoading?: boolean;
  playlistId?: string;
  isHistoric?: true;
}) {
  const { refId, type, title, coverPhoto, desc: descData, songData } = data;
  const { turnOnPlayer } = usePlayerContext();
  const desc = descData || type;
  const baseUrl = {
    album: "/album",
    artist: "/artist",
    user: "/user",
    playlist: "/playlist",
  };
  const goTo = baseUrl[type.toLowerCase() as UrlValues]
    ? `${baseUrl[type.toLowerCase() as UrlValues]}/${refId}`
    : "/search";

  const { refresh, push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [songSelected, setSongSelected] = useState<{ createAt: string; songId: string } | null>(
    data.songData?.songSelected || null
  );

  const handleHistoric = async (action?: string) => {
    if (!username) return;
    setIsLoading(true);
    const { songData, ...rest } = data;
    await fetch(`/api/search`, {
      method: "PATCH",
      body: JSON.stringify({
        ...rest,
        username,
        action,
      }),
    });
    setIsLoading(false);
  };

  const removeFromHistory = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!username) return;
    setIsLoading(true);
    await handleHistoric("remove");
    return refresh(), setIsLoading(false);
  };

  const toggleInPlaylist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!songData || !playlistId) return;
    setIsLoading(true);

    if (songSelected) {
      const data = await fetch(`/api/playlist`, {
        method: "PATCH",
        body: JSON.stringify({ id: playlistId, songSelected, toRemove: true }),
      }).then((res) => res.json());
      setIsLoading(false);
      if (data.error) return toast.error(data.message);
      refresh();
      if (refetch) refetch();
      return setSongSelected(null);
    }

    const data = await fetch(`/api/playlist`, {
      method: "PATCH",
      body: JSON.stringify({ id: playlistId, songSelected: songData.id }),
    }).then((res) => res.json());
    setIsLoading(false);
    refresh();
    if (refetch) refetch();
    if (data.error) return toast.error(data.message);
    setSongSelected(data.newSong);
    refresh();
    if (refetch) refetch();
  };

  const loadingClass = isLoading || loadingProp ? "grayscale animate-pulse pointer-events-none" : "";
  const handleOnClick = () => {
    handleHistoric();
    if (songData) {
      turnOnPlayer([songData], 0);
      return;
    }
    push(goTo);
  };
  return (
    <div
      onClick={handleOnClick}
      className={`w-full flex gap-3 p-2 py-1 duration-150 hover:bg-black-500 active:bg-black items-center cursor-pointer ${loadingClass}`}
    >
      <span className="size-12 md:size-16">
        <Image
          src={coverPhoto}
          className={`h-full w-full ${
            desc.toLowerCase() === "user" || desc.toLowerCase() === "artist" ? "rounded-full" : "rounded-lg"
          }`}
        />
      </span>

      <div className="flex flex-col font-kanit font-light leading-3 md:font-medium">
        <span className="text-lg first-letter:uppercase md:text-xl">{title}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            push(goTo);
            handleHistoric();
          }}
          className="text-white text-opacity-65 text-sm md:text-base w-max hover:text-opacity-100 active:text-orange-500"
        >
          {desc}
        </button>
      </div>
      {playlistId && (
        <button
          onClick={toggleInPlaylist}
          className={`${
            songSelected
              ? "text-green-400 border-green-400"
              : "active:text-orange-500 active:border-orange-500 hover:opacity-100"
          }
       size-7 md:size-8 ml-auto mr-3 border-2 opacity-75 rounded-full flex items-center justify-center cursor-pointer`}
        >
          {songSelected ? <FaCheck /> : <FaPlus />}
        </button>
      )}
      {isHistoric && (
        <button onClick={removeFromHistory} className="ml-auto self-center font-kanit text-xl md:text-2xl">
          X
        </button>
      )}
    </div>
  );
}
