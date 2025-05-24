import { IoIosPause, IoIosPlay } from "react-icons/io";
import { IoPlaySkipBackSharp, IoPlaySkipForward } from "react-icons/io5";

export default function PlayerControls({
  currIndex = 0,
  isPlaying,
  next,
  queueLength,
  previous,
  togglePlayer,
}: {
  isPlaying: boolean;
  currIndex: number;
  next: () => void;
  previous: () => void;
  togglePlayer: () => void;
  queueLength: number;
}) {
  const CurrIcon = isPlaying ? IoIosPause : IoIosPlay;
  return (
    <div className="flex items-center gap-3 md:gap-3 p-2">
      <button
        onClick={previous}
        className={`size-4 md:size-6 ${Number(currIndex) - 1 >= 0 ? "cursor-pointer" : "opacity-50 pointer-events-none"}`}
      >
        <IoPlaySkipBackSharp className="size-full" />
      </button>

      <button onClick={togglePlayer} className="size-8 md:size-10 cursor-pointer">
        <CurrIcon className="size-full" />
      </button>

      <button
        onClick={next}
        className={`size-4 md:size-6 ${
          currIndex + 1 <= queueLength - 1 ? "cursor-pointer" : "opacity-50 pointer-events-none"
        }`}
      >
        <IoPlaySkipForward className="size-full" />
      </button>
    </div>
  );
}
