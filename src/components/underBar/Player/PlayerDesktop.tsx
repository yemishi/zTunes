import SongOptions from "@/components/songOptions/songOptions";
import Image from "@/components/ui/custom/Image";
import ProgressBar from "@/components/ui/inputs/ProgressBar";
import ToggleLike from "@/components/ui/buttons/ToggleLike";
import VolumeInput from "@/components/ui/inputs/VolumeInput";
import { useTempOverlay } from "@/context/Provider";
import usePlayer from "@/hooks/usePlayer";
import { formatDuration } from "@/utils/formatting";
import Link from "next/link";
import { RxDotsVertical } from "react-icons/rx";

export default function PlayerDesktop() {
  const {
    audioRef,
    currentTime,
    duration,
    handleProgress,
    handleVolume,
    volume,
    song,
    onend,
    PlayerControls,
  } = usePlayer();
  if (!song) return;
  const {
    artistId,
    artistName,
    coverPhoto,
    id: songId,
    name: title,
    urlSong,
  } = song;

  const { close, setChildren } = useTempOverlay();
  const Options = () => <SongOptions onclose={close} song={song} />;
  return (
    <div className="w-full h-20 rounded-lg grid grid-cols-[1fr_2fr_1fr] justify-between items-center relative p-2 duration-150 bg-black">
      <ProgressBar
        max={duration || 0}
        value={currentTime}
        onChange={handleProgress}
        onMouseUp={() =>
          audioRef.current ? (audioRef.current.muted = false) : null
        }
        onMouseDown={() =>
          audioRef.current ? (audioRef.current.muted = true) : null
        }
        currentProgress={currentTime / Number(duration)}
        className="rangeOrange bg-orange-600"
        classContainer="!absolute top-0 w-full"
      />
      <span className="flex  gap-3 items-center">
        <PlayerControls />
        <span>{currentTime ? formatDuration(currentTime) : "0s"}</span>-
        <span>{formatDuration(duration as number)}</span>
      </span>

      <div className="flex justify-center gap-3 font-kanit ">
        <Image src={coverPhoto} className="size-11" />
        <div className="flex flex-col">
          <Link href={`/artist/${artistId}`} className="first-letter:uppercase">
            {artistName}
          </Link>
          <span className="text-white text-opacity-60">{title}</span>
        </div>
        <ToggleLike className="ml-4" songId={songId} />
      </div>

      <div className="flex gap-3 ml-auto relative">
        <VolumeInput
          fixed
          onChange={handleVolume}
          value={volume}
          currentProgress={volume}
        />
        <RxDotsVertical
          className="h-10 w-6 ml-auto"
          onClick={() => setChildren(Options)}
        />
      </div>
      <audio onEnded={onend} ref={audioRef} src={urlSong} />
    </div>
  );
}
