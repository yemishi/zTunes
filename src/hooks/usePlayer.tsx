"use client";

import { usePlayerContext } from "@/context/Provider";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { IoIosPause, IoIosPlay } from "react-icons/io";
import { IoPlaySkipBackSharp, IoPlaySkipForward } from "react-icons/io5";

export default function usePlayer() {
  const { currSong, setCurrSong, player } = usePlayerContext();
  const { data: session } = useSession();
  const username = session?.user.name;

  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>();
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(1);

  const togglePlayer = (
    justPlay?: "play" | React.MouseEvent<any, MouseEvent>
  ) => {
    if (audioRef.current?.paused) {
      audioRef.current.play(), setIsPlaying(true);
    } else {
      justPlay !== "play" && (audioRef.current?.pause(), setIsPlaying(false));
    }
  };

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (!audioRef.current) return;
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    };
    if (!audioRef.current) return;

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      if (!audioRef.current) return;

      audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  useEffect(() => {
    togglePlayer("play");
  }, [currSong]);

  const onend = async () => {
    if (!currSong || !player) return;
    if (currSong + 1 < player.length) setCurrSong(currSong + 1);
    else togglePlayer();

    if (username) {
      const songId = player[currSong];
      const body = {
        username,
        songId,
      };
      await fetch("/api/song/playCount", {
        method: "PATCH",
        body: JSON.stringify(body),
      });
    }
  };

  const next = () => {
    if (!Number.isInteger(currSong) || !player) return;
    (currSong as number) + 1 > player.length - 1
      ? setCurrSong(player.length - 1)
      : setCurrSong((currSong as number) + 1);
  };
  const previous = () => {
    if (!Number.isInteger(currSong) || !player) return;
    (currSong as number) - 1 < 0
      ? setCurrSong(0)
      : setCurrSong((currSong as number) - 1);
  };

  const handleProgress = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Number(value);
    setCurrentTime(Number(value));
  };
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.volume = Number(e.target.value);
      setVolume(Number(e.target.value));
    }
  };

  const PlayerControls = () => {
    const CurrIcon = isPlaying ? IoIosPause : IoIosPlay;
    return (
      <div className="flex items-center gap-3 md:gap-3 p-2">
        <IoPlaySkipBackSharp
          onClick={previous}
          className={`size-4 md:size-6 ${
            Number(currSong) - 1 >= 0 ? "cursor-pointer" : "opacity-50"
          }`}
        />

        <CurrIcon
          onClick={togglePlayer}
          className="size-8 md:size-10 cursor-pointer"
        />

        <IoPlaySkipForward
          onClick={next}
          className={`size-4 md:size-6 ${
            player && Number(currSong) + 1 <= player.length - 1
              ? "cursor-pointer"
              : "opacity-50"
          }`}
        />
      </div>
    );
  };

  return {
    handleProgress,
    handleVolume,
    currentTime,
    togglePlayer,
    PlayerControls,
    isPlaying,
    duration,
    previous,
    audioRef,
    volume,
    onend,
    next,
    song:
      player && Number.isInteger(currSong) ? player[currSong as number] : null,
  };
}
