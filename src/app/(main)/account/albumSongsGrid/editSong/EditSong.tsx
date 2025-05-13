"use client";

import { ErrorType, SongType } from "@/types/response";
import { AnimatePresence, motion } from "framer-motion";
import { GiConfirmed } from "react-icons/gi";
import { GiCancel } from "react-icons/gi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { deleteSong } from "@/firebase/handleSong";

import Button from "@/ui/buttons/Button";
import Input from "@/ui/inputs/Input";
import { PopConfirm } from "@/components";
import { useState } from "react";

export default function EditSong({ song }: { song: SongType }) {
  const { name: initialName, albumId, id, artistId, track } = song;

  const [name, setName] = useState(initialName);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { refresh } = useRouter();
  const loadingClass = isLoading ? "pointer-event-none animate-pulse" : "";

  const changeName = async () => {
    if (initialName.toLocaleLowerCase() === name.toLocaleLowerCase()) return;
    setIsLoading(true);
    const body = {
      songId: id,
      albumId,
      name,
    };
    const response: ErrorType = await fetch("/api/song", {
      method: "PATCH",
      body: JSON.stringify(body),
    }).then((res) => res.json());
    if (response.error) {
      setIsLoading(false);
      return toast.error(response.message);
    }
    toast.success(response.message);
    refresh(), setIsEdit(false);
  };

  const removeSong = async () => {
    const body = {
      songId: id,
      artistId,
    };
    setIsLoading(false);
    const response: ErrorType = await fetch(`/api/song`, {
      method: "DELETE",
      body: JSON.stringify(body),
    }).then((res) => res.json());
    if (response.error) return toast.error(response.message);
    await deleteSong(track.url);
    toast.success(response.message);
    refresh();
    setIsLoading(false);
  };

  return (
    <>
      <Button
        onClick={(e) => {
          e.stopPropagation(), setIsEdit(true);
        }}
        className="ml-auto rounded-lg  text-sm bg-white text-black"
      >
        Edit
      </Button>

      <AnimatePresence>
        {isEdit && (
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: "-100%", opacity: 0 }}
            exit={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full h-full flex items-center bg-black-550 absolute left-0 px-3"
          >
            <Input
              disabled={isLoading}
              label="Album name"
              placeholder={name}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <span className="flex gap-2 ml-auto">
              <GiCancel onClick={() => setIsEdit(false)} className={`size-7  duration-150 ${loadingClass}`} />
              <GiConfirmed onClick={changeName} className={`size-7 text-green-500 duration-150 ${loadingClass}`} />
              <RiDeleteBin6Line
                onClick={() => setIsDelete(true)}
                className={`size-7  duration-150 ${loadingClass} text-red-500 `}
              />
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {isDelete && (
        <PopConfirm onClose={() => setIsDelete(false)} confirm={removeSong} name={initialName} isLoading={isLoading} />
      )}
    </>
  );
}
