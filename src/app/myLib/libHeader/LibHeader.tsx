"use client";

import { useSession } from "next-auth/react";
import Image from "@/ui/custom/Image";
import { FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { Modal, PlaylistForm } from "@/components";

export default function LibHeader() {
  const { data: session } = useSession();
  const user = session?.user;

  const [isForm, setIsForm] = useState(false);

  return (
    <div className="w-full bg-[#121212] p-4 sticky top-0 flex items-center gap-2">
      {user?.picture && <Image src={user.picture} className="size-12 rounded-full" />}
      {isForm && (
        <Modal className="modal-container" onClose={() => setIsForm(false)}>
          <PlaylistForm username={user?.name as string} onClose={() => setIsForm(false)} />;
        </Modal>
      )}
      <span className="font-montserrat font-semibold text-xl">Your library</span>
      <button
        onClick={() => setIsForm(true)}
        className="size-10 p-3 md:hidden bg-black-300 brightness-80 cursor-pointer hover:brightness-100 active:scale-105 duration-150 rounded-full ml-auto transition-all"
      >
        <FaPlus />
      </button>
    </div>
  );
}
