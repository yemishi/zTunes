"use client";

import { useEffect, useState } from "react";
import Image from "../../ui/custom/Image";
import PlayerDetails from "./PlayerDetails";
import usePlayer from "../../../hooks/usePlayer";
import getVibrantColor from "@/utils/getVibrantColor";

export default function PlayerMobile() {
  const [vibrantColor, setVibrantColor] = useState<string>();
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const {
    currentTime,
    handleProgress,
    handleVolume,
    togglePlayer,
    previous,
    duration,
    isPlaying,
    audioRef,
    onend,
    PlayerControls,
    song,
    volume,
    next,
  } = usePlayer();

  if (!song) return;
  const { artistName, coverPhoto, name, urlSong } = song;

  useEffect(() => {
    getVibrantColor(coverPhoto).then((res) => setVibrantColor(res))
  }, [song]);

  return (
    <div
      onClick={() => !showDetails && setShowDetails(true)}
      style={{ background: vibrantColor || "rgb(33 33 33)" }}
      className="w-[90%] h-14 rounded-lg flex items-center justify-between p-2 duration-150"
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
      <span onClick={(e) => e.stopPropagation()}>
        <PlayerControls />
      </span>
      <audio
        autoPlay={isPlaying}
        onEnded={onend}
        ref={audioRef}
        src={urlSong}
      />

      <PlayerDetails
        isVisible={showDetails}
        onClose={() => setShowDetails(false)}
        handlers={{
          handleProgress,
          handleVolume,
          togglePlayer,
        }}
        values={{ isPlaying, volume, duration: Number(duration), currentTime }}
        song={song}
        next={next}
        audioRef={audioRef}
        previous={previous}
        vibrantColor={vibrantColor as string}
      />
    </div>
  );
}
