"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaCheck, FaPlus } from "react-icons/fa";
import { IoRemoveCircle } from "react-icons/io5";

import { Image } from "@/ui";
import { usePlayerContext } from "@/context/Provider";
import { SearchType } from "../page";

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
  const router = useRouter();
  const { turnOnPlayer } = usePlayerContext();
  const [isLoading, setIsLoading] = useState(false);
  const [songSelected, setSongSelected] = useState(data.songData?.songSelected ?? null);

  const { refId, type, title, coverPhoto, desc: descData, songData } = data;

  const desc = descData || type;
  const goTo = `/${type.toLowerCase()}/${refId}` as const;

  const loading = isLoading || loadingProp;
  const loadingClass = loading ? "grayscale animate-pulse pointer-events-none" : "";

  const handleHistoric = async (action?: "remove") => {
    if (!username) return;
    try {
      setIsLoading(true);
      const { songData, ...rest } = data;
      await fetch("/api/search", {
        method: "PATCH",
        body: JSON.stringify({ ...rest, username, action }),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    console.log(data);
    handleHistoric();

    if (songData) {
      turnOnPlayer([songData], 0);
    } else {
      router.push(goTo);
    }
  };

  const handleRemoveFromHistory = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    await handleHistoric("remove");
    router.refresh();
  };

  const toggleInPlaylist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!playlistId || !songData) return;

    setIsLoading(true);
    const payload = {
      id: playlistId,
      ...(songSelected ? { songSelected, toRemove: true } : { songSelected: songData.id }),
    };

    const res = await fetch("/api/playlist", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    const result = await res.json();
    setIsLoading(false);

    if (result.error) {
      return toast.error(result.message);
    }

    setSongSelected(songSelected ? null : result.newSong);
    router.refresh();
    refetch?.();
  };

  return (
    <div
      onClick={handleClick}
      className={`w-full flex gap-3 p-2 py-1 hover:bg-black-500 active:bg-black items-center cursor-pointer ${loadingClass}`}
    >
      <span className="size-12 md:size-16">
        <Image
          src={coverPhoto}
          className={`h-full w-full ${["user", "artist"].includes(desc.toLowerCase()) ? "rounded-full" : "rounded-lg"}`}
        />
      </span>

      <div className="flex flex-col font-kanit font-light leading-3 md:font-medium">
        <span className="text-lg first-letter:uppercase md:text-xl">{title}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(goTo);
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
          } size-7 md:size-8 ml-auto mr-3 border-2 opacity-75 rounded-full flex items-center justify-center`}
        >
          {songSelected ? <FaCheck /> : <FaPlus />}
        </button>
      )}

      {isHistoric && (
        <button
          onClick={handleRemoveFromHistory}
          className="ml-auto rounded-lg self-center font-kanit text-xl md:text-2xl cursor-pointer hover:brightness-90 active:brightness-110"
        >
          <IoRemoveCircle className="size-10" />
        </button>
      )}
    </div>
  );
}
