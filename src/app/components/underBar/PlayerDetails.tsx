"use client";

import { SongType } from "@/types/response";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { TbDots } from "react-icons/tb";
import SongOptions from "../songOptions/songOptions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { formatDuration } from "@/app/utils/formatting";
import AddToPlaylist from "../songOptions/addToPlaylist";
import Image from "../ui/Image";
import ProgressBar from "../ui/ProgressBar";
import { MdPlayCircleFilled } from "react-icons/md";
import { PiPauseCircleFill } from "react-icons/pi";
import Link from "next/link";
import { IoPlaySkipBackSharp, IoPlaySkipForward } from "react-icons/io5";
import ToggleLike from "../ui/ToggleLike";
import { LiaVolumeUpSolid } from "react-icons/lia";

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
    handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    togglePlayer: () => void;
  };
  vibrantColor: string;
  isVisible: boolean;
  next: () => void;
  previous: () => void;
  onClose: () => void;
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
}: PropsType) {
  const { coverPhoto, name, artistId, artistName, id } = song;

  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [showVolume, setShowVolume] = useState<boolean>(false);

  const [toPlaylist, setToPlaylist] = useState<{
    songSelected: { songId: string; createdAt: Date };
    coverPhoto: string;
    title: string;
  } | null>(null);

  const { handleProgress, handleVolumeChange, togglePlayer } = handlers;

  const { currentTime, duration, volume, isPlaying } = values;
  const { data: session } = useSession();
  const user = session?.user;
  const { push } = useRouter();

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
            background: `linear-gradient(to bottom,${vibrantColor} 0% ,#121212 100%)`,
          }}
          className={`fixed top-0 left-0 w-full h-full z-40 p-3 gap-6 font-kanit flex flex-col`}
        >
          <div className="flex justify-between items-center">
            <button onClick={onClose} className="size-12 p-2">
              <IoIosArrowDown className="h-full w-full" />
            </button>
            <span className="text-lg flex-1 text-center">{name}</span>

            <button
              onClick={() => setShowOptions(true)}
              className="size-12 p-2"
            >
              <TbDots className="h-full w-full" />
            </button>
          </div>

          <div className="flex flex-col flex-1 max-h-[500px] w-full justify-center gap-6 my-10">
            <Image src={coverPhoto} className="self-center  flex-1 w-max" />
            <div className="w-full  flex flex-col items-center">
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

          <div className="flex flex-col gap-2 px-3">
            <ProgressBar
              value={currentTime}
              onChange={handleProgress}
              max={duration || 0}
              currentProgress={currentTime / Number(duration)}
            />

            <div className="flex w-full font-poppins justify-between text-xs font-light text-white text-opacity-65">
              <span>{formatDuration(currentTime || 0, true)}</span>
              <span>{formatDuration(duration || 0, true)}</span>
            </div>
          </div>

          <div
            className="self-end flex items-center"
            onMouseLeave={() => setShowVolume(false)}
            onMouseEnter={() => setShowVolume(true)}
          >
            {showVolume && (
              <ProgressBar
                className="rotate-180"
                value={volume}
                onChange={handleVolumeChange}
                max={1}
                min={0}
                step={0.01}
                currentProgress={volume}
              />
            )}
            <LiaVolumeUpSolid  className="size-8 rotate-180" />
          </div>

          <div className="grid grid-cols-3 gap-6 items-center px-4 ">
            <ToggleLike isLiked={isLiked} setIsLiked={setIsLiked} songId={id} />

            <div className="flex gap-3">
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
          </div>

          {showOptions && (
            <SongOptions
              song={song}
              toPlaylist={(
                songSelected: { songId: string; createdAt: Date },
                coverPhoto: string,
                title: string
              ) => {
                if (!user?.name) {
                  push("/sign-in");
                  return toast.info("You must be logged first");
                }
                setToPlaylist({ songSelected, coverPhoto, title });
                setShowOptions(false);
              }}
              username={user?.name}
              onclose={() => setShowOptions(false)}
            />
          )}

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
