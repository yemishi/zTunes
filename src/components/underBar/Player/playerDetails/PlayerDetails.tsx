"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SongType } from "@/types/response";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { IoIosArrowDown } from "react-icons/io";
import { TbDots } from "react-icons/tb";
import { MdPlayCircleFilled } from "react-icons/md";
import { PiPauseCircleFill } from "react-icons/pi";
import { IoPlaySkipBackSharp, IoPlaySkipForward } from "react-icons/io5";
import { formatDuration } from "@/utils/formatting";

import SongOptions from "@/components/songOptions/songOptions";

import Image from "@/ui/custom/Image";
import ProgressBar from "@/components/underBar/Player/progressBar/ProgressBar";
import ToggleLike from "@/ui/buttons/ToggleLike";
import VolumeInput from "@/components/underBar/Player/progressBar/volumeHandler/VolumeHandler";

type PropsType = {
  song: SongType;
  values: {
    volume: number;
    duration: number;
    currentTime: number;
    isPlaying: boolean;
  };
  handlers: {
    handleProgress: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleVolume: (e: React.ChangeEvent<HTMLInputElement>) => void;
    next: () => void;
    previous: () => void;
    togglePlayer: () => void;
  };
  vibrantColor?: { color: string; isLight: boolean };
  isVisible: boolean;

  onClose: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  username?: string;
};

export default function PlayerDetails({
  song,
  isVisible,
  onClose,
  vibrantColor,
  handlers,
  values,
  audioRef,
  username,
}: PropsType) {
  const { coverPhoto, name, artistId, artistName, id, album } = song;

  const { handleProgress, handleVolume, togglePlayer, next, previous } = handlers;

  const { currentTime, duration, volume, isPlaying } = values;
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="song-detail-modal"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.2 }}
          style={{
            background: `linear-gradient(to bottom,${vibrantColor?.color || "rgb(33 33 33)"} 0% ,#121212 100%)`,
          }}
          className={`fixed md:hidden overflow-y-auto top-0 left-0 w-full h-screen z-40 p-3 gap-3 font-kanit flex flex-col 
            ${vibrantColor?.isLight ? "text-black" : "text-white"}`}
        >
          <div className="grid grid-cols-[.5fr_1fr_.5fr] items-center">
            <button onClick={onClose} className="size-12 p-2">
              <IoIosArrowDown className="h-full w-full" />
            </button>
            <div className="flex flex-col items-center text-lg">
              <span className="text-sm brightness-75">From the album</span>
              <span className="font-medium text-center">{album.name}</span>
            </div>
            <SongOptions
              iconClassName="rotate-90 w-8 ml-auto "
              song={song}
              username={username}
              vibrantColor={vibrantColor}
            />
          </div>

          <div className="flex flex-col flex-1 max-h-[500px] w-full justify-center gap-6 my-10">
            <Image src={coverPhoto} className="mx-auto !h-[400px] w-full object-cover" />
            <div className="grid grid-cols-[.5fr_1fr_.5fr] ">
              <ToggleLike songId={id} username={username} className="w-fit" />
              <div className=" flex flex-col text-center items-center self-center">
                <span className="text-2xl first-letter:uppercase">{name}</span>
                <Link
                  onClick={onClose}
                  href={`/artist/${artistId}`}
                  className="first-letter:uppercase w-fit font-light brightness-75 "
                >
                  {artistName}
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-2">
            <div className="flex flex-col gap-2 px-3 relative">
              <ProgressBar
                className="rangeOrange bg-orange-600"
                classContainer="absolute top-0 w-full"
                value={currentTime}
                onChange={handleProgress}
                onMouseUp={() => (audioRef.current ? (audioRef.current.muted = false) : null)}
                onMouseDown={() => (audioRef.current ? (audioRef.current.muted = true) : null)}
                max={duration || 0}
                currentProgress={currentTime / Number(duration)}
              />

              <div className="flex w-full font-poppins justify-between text-xs text-white">
                <span>{formatDuration(currentTime || 0, true)}</span>
                <span>{formatDuration(duration || 0, true)}</span>
              </div>
            </div>

            <div className="flex gap-3 mx-auto text-white">
              <button onClick={previous}>
                <IoPlaySkipBackSharp className="size-7" />
              </button>

              <button onClick={togglePlayer}>
                {isPlaying ? <PiPauseCircleFill className="size-14" /> : <MdPlayCircleFilled className="size-14" />}
              </button>

              <button onClick={next}>
                <IoPlaySkipForward className="size-7 " />
              </button>
            </div>
            <VolumeInput
              className="w-full px-3 text-white"
              barContainerClass="w-full"
              fixed
              onChange={handleVolume}
              value={volume}
              currentProgress={volume}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
