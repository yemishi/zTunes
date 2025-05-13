"use client";

import { useState } from "react";
import Image from "@/ui/custom/Image";
import PlayerDetails from "./playerDetails/PlayerDetails";
import { UsePlayerType } from "../../../hooks/usePlayer";
import ProgressBar from "@/components/underBar/Player/progressBar/ProgressBar";
import Link from "next/link";
import ToggleLike from "@/ui/buttons/ToggleLike";
import { RxDotsVertical } from "react-icons/rx";
import VolumeInput from "@/components/underBar/Player/progressBar/volumeHandler/VolumeHandler";
import Modal from "@/components/modal/Modal";
import SongOptions from "@/components/songOptions/songOptions";

export default function Player({ player }: { player: UsePlayerType }) {
  const [showDetails, setShowDetails] = useState(false);
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
  } = song;

  const [isModal, setIsModal] = useState(false);
  const closeModal = () => setIsModal(false);

  return (
    <div
      onClick={() => !showDetails && setShowDetails(true)}
      style={{ background: "rgb(33 33 33)" }}
      className="w-[90%] h-14 rounded-lg flex items-center justify-between p-2 transition-all md:w-full md:h-20 md:rounded-lg md:grid grid-cols-[1fr_2fr_1fr] md:relative md:!bg-black"
    >
      {isModal && (
        <Modal className="modal-container" onClose={closeModal}>
          <SongOptions onclose={closeModal} song={song} />
        </Modal>
      )}
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
          <span className="first-letter:uppercase text-sm text-gray-400">{artistName}</span>
        </div>
      </div>

      <span onClick={(e) => e.stopPropagation()}>
        <PlayerControls />
      </span>

      <div className="hidden md:flex justify-center gap-3 font-kanit">
        <Image src={coverPhoto} className="size-13 rounded-lg" />
        <div className="flex flex-col">
          <Link href={`/artist/${artistId}`} className="first-letter:uppercase">
            {artistName}
          </Link>
          <span className="text-white text-opacity-60">{title}</span>
        </div>
        <ToggleLike className="ml-4" songId={songId} />
      </div>

      <div className="hidden md:flex gap-3 ml-auto relative">
        <VolumeInput fixed onChange={handleVolume} value={volume} currentProgress={volume} />
        <RxDotsVertical className="h-10 w-6 ml-auto" onClick={() => setIsModal(true)} />
      </div>

      <audio autoPlay={isPlaying} onEnded={onend} ref={audioRef} src={url} />

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
        vibrantColor={"rgb(33 33 33)"}
      />
    </div>
  );
}
