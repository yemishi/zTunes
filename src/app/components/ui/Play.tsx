"use client";

import { usePlayerContext } from "@/context/Provider";
import { SongType } from "@/types/response";
import { HTMLAttributes, useEffect, useState } from "react";
import { FaCirclePlay } from "react-icons/fa6";
import { FaPauseCircle } from "react-icons/fa";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  songs: SongType[];
}

export default function Play({ songs, ...props }: ButtonProps) {
  const { setPlayer, player, setCurrSong } = usePlayerContext();
  const [isPlay, setIsPlay] = useState<boolean>(player === songs);

  useEffect(() => setIsPlay(player === songs), [player]);
  return (
    <button
      onClick={() => {
        setPlayer(songs), setCurrSong(0);
      }}
      className={`${props.className ? props.className : ""} ${
        props.className?.includes("size" || "w-") ? "" : "size-10"
      } ${
        props.className?.includes("text-") ? "" : "text-yellow-600"
      } flex items-center hover:scale-105 active:opacity-80 duration-150`}
    >
      {isPlay ? (
        <FaPauseCircle className="h-full w-full" />
      ) : (
        <FaCirclePlay className="h-full w-full" />
      )}
    </button>
  );
}
