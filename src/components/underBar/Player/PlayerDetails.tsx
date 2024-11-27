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

import SongOptions from "../../songOptions/songOptions";
import AddToPlaylist from "../../songOptions/addToPlaylist";
import Image from "../../ui/custom/Image";
import ProgressBar from "../../ui/inputs/ProgressBar";
import ToggleLike from "../../ui/buttons/ToggleLike";
import { useTempOverlay } from "@/context/Provider";
import VolumeInput from "@/components/ui/inputs/VolumeInput";

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
    togglePlayer: () => void;
  };
  vibrantColor: string;
  isVisible: boolean;
  next: () => void;
  previous: () => void;
  onClose: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
};

export default function PlayerDetails({
  song,
  isVisible,
  next,
  onClose,
  previous,
  vibrantColor,
  handlers,
  values,
  audioRef,
}: PropsType) {
  const { coverPhoto, name, artistId, artistName, id, albumName } = song;

  const [toPlaylist, setToPlaylist] = useState<{
    songSelected: { songId: string; createdAt: Date };
    coverPhoto: string;
    title: string;
  } | null>(null);

  const { handleProgress, handleVolume, togglePlayer } = handlers;

  const { currentTime, duration, volume, isPlaying } = values;
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname]);

  const { setChildren, close } = useTempOverlay();
  const Options = () => <SongOptions song={song} onclose={close} />;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="modal"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.2 }}
          style={{
            background: `linear-gradient(to bottom,${vibrantColor || "rgb(33 33 33)"
              } 0% ,#121212 100%)`,
          }}
          className={`fixed overflow-auto top-0 left-0 w-full h-full z-40 p-3 gap-6 font-kanit flex flex-col`}
        >
          <div className="flex justify-between items-center">
            <button onClick={onClose} className="size-12 p-2">
              <IoIosArrowDown className="h-full w-full" />
            </button>
            <span className="text-lg flex-1 text-center">{albumName}</span>

            <button
              onClick={() => setChildren(Options)}
              className="size-12 p-2"
            >
              <TbDots className="h-full w-full" />
            </button>
          </div>

          <div className="flex flex-col flex-1 max-h-[500px] w-full justify-center gap-6 my-10">
            <Image src={coverPhoto} className="self-center flex-1 w-max" />
            <div className="flex w-full relative">
              <ToggleLike songId={id} className="absolute right-0"/>
              <div className="max-w-[80%] w-auto mx-auto flex flex-col items-center self-center ">
                <span className="text-2xl first-letter:uppercase">{name}</span>
                <Link
                  onClick={onClose}
                  href={`/artist/${artistId}`}
                  className="text-gray-400 first-letter:uppercase font-light"
                >
                  {artistName}
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 px-3">
            <ProgressBar
              value={currentTime}
              onChange={handleProgress}
              onMouseUp={() =>
                audioRef.current ? (audioRef.current.muted = false) : null
              }
              onMouseDown={() =>
                audioRef.current ? (audioRef.current.muted = true) : null
              }
              max={duration || 0}
              currentProgress={currentTime / Number(duration)}
            />

            <div className="flex w-full font-poppins justify-between text-xs font-light text-white text-opacity-65">
              <span>{formatDuration(currentTime || 0, true)}</span>
              <span>{formatDuration(duration || 0, true)}</span>
            </div>
          </div>

          <div className="flex gap-3 mx-auto">
              <button onClick={previous}>
                <IoPlaySkipBackSharp className="size-7" />
              </button>

              <button onClick={togglePlayer}>
                {isPlaying ? (
                  <PiPauseCircleFill className="size-14" />
                ) : (
                  <MdPlayCircleFilled className="size-14" />
                )}
              </button>

              <button onClick={next}>
                <IoPlaySkipForward className="size-7 " />
              </button>
          </div>
          <VolumeInput
            className="w-full px-3"
            barClass="w-full"
            fixed
            onChange={handleVolume}
            value={volume}
            currentProgress={volume}
          />

          {toPlaylist && (
            <AddToPlaylist
              username={user?.name}
              userAvatar={user?.picture}
              options={toPlaylist}
              onclose={() => setToPlaylist(null)}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
