"use client";

import { useSession } from "next-auth/react";
import Image from "../../components/ui/custom/Image";
import { FaPlus } from "react-icons/fa6";
import NewPlaylistForm from "../../components/form/NewPlaylistForm";
import { useTempOverlay } from "@/context/Provider";

export default function LibHeader() {
  const { data: session } = useSession();
  const user = session?.user;
  const { close, setChildren } = useTempOverlay();
  const Form = () => (
    <NewPlaylistForm username={user?.name as string} onclose={close} />
  );

  return (
    <div className="w-full bg-[#121212] p-4 sticky top-0 flex items-center gap-2">
      <Image src={user?.picture as string} className="size-12 rounded-full" />

      <span className="font-montserrat font-semibold text-xl ">
        Your library
      </span>
      <button
        onClick={() => setChildren(Form)}
        className="size-10 p-3 md:hidden bg-black-450 hover:bg-opacity-75 active:scale-105 duration-150 rounded-full ml-auto"
      >
        <FaPlus className="text-zinc-400 h-full w-full" />
      </button>
    </div>
  );
}
