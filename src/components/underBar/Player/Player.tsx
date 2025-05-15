"use client";

import { useState } from "react";
import Image from "@/ui/custom/Image";
import PlayerDetails from "./playerDetails/PlayerDetails";
import { UsePlayerType } from "../../../hooks/usePlayer";
import ProgressBar from "@/components/underBar/Player/progressBar/ProgressBar";
import Link from "next/link";
import ToggleLike from "@/ui/buttons/ToggleLike";
import VolumeInput from "@/components/underBar/Player/progressBar/volumeHandler/VolumeHandler";
import SongOptions from "@/components/songOptions/songOptions";
import { IoMdWater } from "react-icons/io";
import { useSession } from "next-auth/react";

export default function Player({ player }: { player: UsePlayerType }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isVibrant, setIsVibrant] = useState(true);
  if (!player.song) return;
  const {
    currentTime,
    handleProgress,
    handleVolume,
    togglePlayer,
    previous,
    isPlaying,
    audioRef,
    onend,
    PlayerControls,
    song,
    volume,
    next,
  } = player;
  const {
    artistId,
    artistName,
    coverPhoto,
    id: songId,
    name: title,
    track: { duration, url },
    album,
  } = song;
  const { data: session } = useSession();
  const username = session?.user?.name;
  const bgColor = album.vibrantColor?.color;
  const isLight = album.vibrantColor?.isLight;
  return (
    <div
      onClick={() => !showDetails && setShowDetails(true)}
      style={bgColor && isVibrant ? { background: bgColor } : {}}
      className={`w-[90%] h-14 rounded-lg flex items-center justify-between p-2 md:w-full md:h-20 transition-colors md:rounded-none md:grid grid-cols-[1fr_2fr_1fr]
         bg-black-400 md:bg-black ${isLight && isVibrant ? "text-black" : "text-white"}`}
    >
      <ProgressBar
        max={duration}
        value={currentTime}
        onChange={handleProgress}
        onMouseUp={() => (audioRef.current ? (audioRef.current.muted = false) : null)}
        onMouseDown={() => (audioRef.current ? (audioRef.current.muted = true) : null)}
        currentProgress={currentTime / Number(duration)}
        className="rangeOrange bg-orange-600"
        classContainer="!absolute top-0 w-full"
      />
      <div className="flex gap-2 font-kanit items-center md:hidden">
        <Image src={coverPhoto} className="size-10 rounded" />
        <div className="flex flex-col">
          <span>{title}</span>
          <span className="first-letter:uppercase text-sm">{artistName}</span>
        </div>
      </div>

      <span onClick={(e) => e.stopPropagation()}>
        <PlayerControls />
      </span>

      <div className="hidden md:flex justify-center gap-3 font-kanit">
        <IoMdWater
          onClick={() => setIsVibrant(!isVibrant)}
          className={`size-9 hover:brightness-90 transition-all self-center mr-3 cursor-pointer ${!isVibrant && bgColor ? `text-[${bgColor}]` : "text-black-400"}`}
        />
        <Image src={coverPhoto} className="size-13 rounded-lg" />
        <div className="flex flex-col font-medium">
          <Link href={`/artist/${artistId}`} className="first-letter:uppercase">
            {artistName}
          </Link>
          <span className="">{title}</span>
        </div>
        <ToggleLike className="ml-4" songId={songId} username={username} />
      </div>

      <div className="hidden md:flex gap-3 ml-auto relative">
        <VolumeInput
          barClass={isVibrant && isLight ? "bg-black" : ""}
          fixed
          onChange={handleVolume}
          value={volume}
          currentProgress={volume}
        />
        <SongOptions
          className="-top-45 right-5"
          vibrantColor={isVibrant ? album.vibrantColor : undefined}
          song={song}
          username={username}
        />
      </div>

      <audio autoPlay onEnded={onend} ref={audioRef} src={url} />

      <PlayerDetails
        isVisible={showDetails}
        username={username}
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
        vibrantColor={album.vibrantColor?.color || "#212121"}
      />
    </div>
  );
}
