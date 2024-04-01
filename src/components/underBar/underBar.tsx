"use client";

import { IoPlaySkipBackSharp, IoPlaySkipForward } from "react-icons/io5";
import NavBarMobile from "./navBarMobile";
import PlayerMobile from "./Player/PlayerMobile";
import { usePlayerContext } from "@/context/Provider";
import { IoIosPlay } from "react-icons/io";
import { urlMatch } from "@/utils/fnc";
import checkDev from "@/utils/isMobile";
import PlayerDesktop from "./Player/PlayerDesktop";

export default function UnderBar() {
  const hidden = () =>
    urlMatch("sign-in") ||
    urlMatch("sign-up") ||
    urlMatch("validation") ||
    urlMatch("password-reset");

  if (hidden()) return;
  const isMobile = checkDev();
  const { currSong, player } = usePlayerContext();
  return (
    <div className="w-full fixed bottom-0 flex flex-col gap-2 items-center">
      {Number.isInteger(currSong) && player ? (
        isMobile ? (
          <PlayerMobile />
        ) : (
          <PlayerDesktop />
        )
      ) : (
        <div
          className="w-[90%] h-14  rounded-lg flex items-center justify-between p-2 duration-150 bg-black-400 opacity-50
         md:w-full md:h-20 md:rounded-lg md:p-2 md:bg-black md:opacity-100"
        >
          <div className="flex ml-auto items-center gap-3 p-2 md:mr-auto md:ml-0">
            <IoPlaySkipBackSharp className="size-4 text-gray-500 md:size-6 " />
            <IoIosPlay className="size-8 text-gray-500 md:size-10 " />
            <IoPlaySkipForward className="size-4 text-gray-500 md:size-6" />
          </div>
        </div>
      )}
      {isMobile && <NavBarMobile />}
    </div>
  );
}
