"use client";
import { usePlayerContext } from "@/context/Provider";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoPlaySkipForward } from "react-icons/io5";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { IoIosPlay } from "react-icons/io";
import { IoIosPause } from "react-icons/io";
import Image from "../ui/Image";
import Vibrant from "node-vibrant";
import PlayerDetails from "./PlayerDetails";
import { formatDuration } from "@/app/utils/formatting";
import ProgressBar from "../ui/ProgressBar";

export default function Player() {
  const { currSong, player, setCurrSong, setPlayer } = usePlayerContext();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [vibrantColor, setVibrantColor] = useState<string>();
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [duration, setDuration] = useState<number>();

  if (!player || !Number.isInteger(currSong) || currSong === undefined) return;

  const { coverPhoto, name, artistName } = player[currSong];

  const togglePlayer = () => {
    if (audioRef.current?.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`/api/vibrant-color?imgUrl=${coverPhoto}`).then(
        (res) => res.json()
      );
      setVibrantColor(data);
    };
    fetchData();
  }, [currSong, player]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      if (!audioRef.current) return;

      audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const next = () =>
    currSong + 1 > player?.length - 1
      ? setCurrSong(player?.length - 1)
      : setCurrSong(currSong + 1);

  const previous = () =>
    currSong - 1 < 0 ? setCurrSong(0) : setCurrSong(currSong - 1);

  const handleProgress = (e: ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Number(e.target.value);
    setCurrentTime(Number(e.target.value));
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.volume = Number(e.target.value);
      setVolume(Number(e.target.value));
    }
  };

  return (
    <div
      onClick={() => !showDetails && setShowDetails(true)}
      style={{ background: vibrantColor || "rgb(78,62,86)" }}
      className="w-[90%] h-14 rounded-lg flex items-center justify-between p-2 duration-100"
    >
      <div className="flex gap-2 font-kanit items-center">
        <Image src={coverPhoto} className="size-10 rounded" />
        <div className="flex flex-col">
          <span>{name}</span>
          <span className="first-letter:uppercase text-sm text-gray-400">
            {artistName}
          </span>
        </div>
      </div>

      {/*       <ProgressBar
        value={currentTime}
        onChange={handleProgress}
        max={duration || 0}
        onClick={(e) => e.stopPropagation()}
        currentProgress={currentTime / Number(duration)}
      /> */}

      {/*       <ProgressBar
        vertical
        value={volume}
        onChange={handleVolumeChange}
        className="bg-black"
        max={1.0}
        min={0.0}
        step={0.01}
        onClick={(e) => {
          e.stopPropagation();
        }}
        currentProgress={Number(volume)}
      /> */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex  items-center gap-3 p-2"
      >
        <IoPlaySkipBackSharp onClick={previous} className="size-4" />
        {isPlaying ? (
          <IoIosPause onClick={togglePlayer} className="size-8 " />
        ) : (
          <IoIosPlay onClick={togglePlayer} className="size-8 " />
        )}
        <IoPlaySkipForward onClick={next} className="size-4 " />
      </div>

      <audio

        autoPlay={isPlaying}
        onEnded={() => {
          setCurrSong(currSong + 1);
        }}
        ref={audioRef}
        src={player[currSong].urlSong}
      />

      <PlayerDetails
        isVisible={showDetails}
        onClose={() => setShowDetails(false)}
        handlers={{ handleProgress, handleVolumeChange, togglePlayer }}
        values={{ isPlaying, volume, duration: Number(duration), currentTime }}
        song={player[currSong]}
        next={next}
        previous={previous}
        vibrantColor={vibrantColor as string}
      />
    </div>
  );
}
