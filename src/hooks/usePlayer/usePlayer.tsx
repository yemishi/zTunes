"use client";

import { usePlayerContext } from "@/context/Provider";
import { SongType } from "@/types/response";
import { useSession } from "next-auth/react";
import { JSX, RefObject, useEffect, useRef, useState } from "react";
import { IoIosPause, IoIosPlay } from "react-icons/io";
import { IoPlaySkipBackSharp, IoPlaySkipForward } from "react-icons/io5";

export default function usePlayer() {
  const { currSong, setCurrSong, player } = usePlayerContext();
  const { data: session } = useSession();
  const username = session?.user.name;

  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(1);

  const togglePlayer = async (justPlay?: "play" | React.MouseEvent<any, MouseEvent>) => {
    if (!audioRef.current) return;

    if (audioRef.current.paused || justPlay === "play") {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn("Playback failed:", err);
        setIsPlaying(false);
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (!audioRef.current) return;
      setCurrentTime(audioRef.current.currentTime);
    };
    if (!audioRef.current) return;

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      if (!audioRef.current) return;

      audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [currSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => {
      audio.play().catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Audio play error:", err);
        }
      });
      setIsPlaying(true);
    };

    audio.addEventListener("canplaythrough", handleCanPlay);

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlay);
    };
  }, [currSong, player]);

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
    if (!Number.isInteger(currSong) || !!!player) return;
    (currSong as number) + 1 > player.length - 1
      ? setCurrSong(player.length - 1)
      : setCurrSong((currSong as number) + 1);
  };
  const previous = () => {
    if (!Number.isInteger(currSong) || !player) return;
    (currSong as number) - 1 < 0 ? setCurrSong(0) : setCurrSong((currSong as number) - 1);
  };

  const handleProgress = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
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

  return {
    handleProgress,
    handleVolume,
    currentTime,
    togglePlayer,
    isPlaying,
    previous,
    audioRef,
    volume,
    onend,
    next,
    currIndex: currSong,
    queueLength: player?.length,
    song: player && Number.isInteger(currSong) ? player[currSong as number] : null,
  };
}

export interface UsePlayerType {
  handleProgress: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVolume: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentTime: number;
  currIndex: number;
  togglePlayer: (justPlay?: "play" | React.MouseEvent<any, MouseEvent>) => void;
  isPlaying: boolean;
  previous: () => void;
  queueLength: number;
  audioRef: RefObject<HTMLAudioElement>;
  volume: number;
  onend: () => Promise<void>;
  next: () => void;
  song: SongType;
}
