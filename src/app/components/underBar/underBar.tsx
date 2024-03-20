"use client";

import NavBarMobile from "./navBarMobile";
import Player from "./Player";
import { usePlayerContext } from "@/context/Provider";

export default function UnderBar() {
  const { currSong, player } = usePlayerContext();
  return (
    <div className="w-full fixed bottom-0 flex flex-col gap-2 items-center">
      {Number.isInteger(currSong) && player ? <Player /> : ""}
      <NavBarMobile />
    </div>
  );
}
