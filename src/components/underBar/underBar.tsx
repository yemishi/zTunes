"use client";

import { IoPlaySkipBackSharp, IoPlaySkipForward } from "react-icons/io5";
import NavBarMobile from "./navBarMobile";
import Player from "./Player/Player";
import { IoIosPlay } from "react-icons/io";

import usePlayer, { UsePlayerType } from "@/hooks/usePlayer";

export default function UnderBar() {
  const player = usePlayer();

  return (
    <div className="w-full fixed bottom-0 flex flex-col gap-2 items-center">
      {player.song ? (
        <Player player={player as UsePlayerType} />
      ) : (
        <div className=" bg-black-400/50 w-[90%] h-14 rounded-lg flex items-center justify-between p-2 md:w-full md:h-20 md:bg-black">
          <div className="flex ml-auto items-center gap-3 p-2 md:mr-auto md:ml-0">
            <IoPlaySkipBackSharp className="size-4 text-gray-500 md:size-6 " />
            <IoIosPlay className="size-8 text-gray-500 md:size-10" />
            <IoPlaySkipForward className="size-4 text-gray-500 md:size-6" />
          </div>
        </div>
      )}
      <NavBarMobile />
    </div>
  );
}
