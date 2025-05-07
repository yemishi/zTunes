"use client";

import { useSession } from "next-auth/react";
import Image from "@/components/ui/custom/Image";
import { FaPlus } from "react-icons/fa6";
import NewPlaylistForm from "@/components/form/NewPlaylistForm";
import { useState } from "react";
import Modal from "@/components/modal/Modal";

export default function LibHeader() {
  const { data: session } = useSession();
  const user = session?.user;

  const [isForm, setIsForm] = useState(false);

  return (
    <div className="w-full bg-[#121212] p-4 sticky top-0 flex items-center gap-2">
      {user?.picture && <Image src={user.picture} className="size-12 rounded-full" />}
      {isForm && (
        <Modal
          className="w-screen h-screen overflow-x-hidden overflow-y-clip max-w-3xl md:h-[900px] md:rounded-lg mx-auto my-auto bg-gray-300 p-4"
          onClose={() => setIsForm(false)}
        >
          <NewPlaylistForm username={user?.name as string} onclose={() => setIsForm(false)} />;
        </Modal>
      )}
      <span className="font-montserrat font-semibold text-xl">Your library</span>
      <button
        onClick={() => setIsForm(true)}
        className="size-10 p-3 md:hidden bg-black-450 hover:bg-opacity-75 active:scale-105 duration-150 rounded-full ml-auto"
      >
        <FaPlus className="text-zinc-400 h-full w-full" />
      </button>
    </div>
  );
}
