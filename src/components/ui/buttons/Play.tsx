"use client";

import { usePlayerContext } from "@/context/Provider";
import { SongType } from "@/types/response";
import { HTMLAttributes, useEffect, useState } from "react";
import { FaCirclePlay } from "react-icons/fa6";
import { FaPauseCircle } from "react-icons/fa";
import { cleanClasses } from "@/utils/helpers";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  songs: SongType[];
}

export default function Play({ songs, ...props }: ButtonProps) {
  const { setPlayer, player, setCurrSong } = usePlayerContext();
  const { className, ...rest } = props;
  const [isPlay, setIsPlay] = useState<boolean>(player === songs);
  const Icon = isPlay ? FaPauseCircle : FaCirclePlay;
  useEffect(() => setIsPlay(player === songs), [player]);
  return (
    <button
      onClick={() => {
        if (songs.length === 0) return;
        setPlayer(songs), setCurrSong(0);
      }}
      className={cleanClasses(
        className,
        "size-10 text-yellow-600  flex items-center hover:scale-105 active:opacity-80 duration-150"
      )}
    >
      <Icon className="h-full w-full" />
    </button>
  );
}
