"use client";

import { useSession } from "next-auth/react";
import Image from "../components/ui/Image";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import NewPlaylistForm from "../components/form/NewPlaylistForm";

export default function LibHeader() {
  const { data: session } = useSession();
  const user = session?.user;
  const [isNewPlaylist, setIsNewPlaylist] = useState<boolean>(false);
  return (
    <div className="w-full bg-[#121212] p-4 sticky top-0 flex items-center gap-2">
      <Image src={user?.picture as string} className="size-12 rounded-full" />

      <span className="font-montserrat font-semibold text-xl ">
        Your library
      </span>
      <button
        onClick={() => setIsNewPlaylist(true)}
        className="size-10 p-3 bg-black-450 hover:bg-opacity-75 active:scale-105 duration-150 rounded-full ml-auto"
      >
        <FaPlus className="text-zinc-400 h-full w-full" />
      </button>

      {isNewPlaylist && (
        <div
          onClick={() => setIsNewPlaylist(false)}
          className="fixed top-0 left-0 h-full pb-16 w-full z-20 backdrop-brightness-75 backdrop-blur-sm flex items-center justify-center overflow-auto"
        >
          <NewPlaylistForm
            onclose={() => setIsNewPlaylist(false)}
            username={user?.name as string}
            isAdmin={user?.isAdmin as boolean}
          />
        </div>
      )}
    </div>
  );
}
