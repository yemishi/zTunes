"use client";
import { ErrorType, SongType } from "@/types/response";
import { AnimatePresence, motion } from "framer-motion";
import { GiConfirmed } from "react-icons/gi";
import { GiCancel } from "react-icons/gi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { deleteSong } from "@/firebase/handleSong";

import Button from "@/components/ui/buttons/Button";
import Input from "@/components/ui/inputs/Input";
import PopupDelete from "../PopupDelete";
import useObject from "@/hooks/useObject";

export default function EditSong({ song }: { song: SongType }) {
  const { name: initialName, albumId, id, artistId, urlSong } = song;
  const {
    state: { isDelete, isEdit, isLoading, name },
    updateObject,
  } = useObject({
    name: initialName,
    isEdit: false,
    isDelete: false,
    isLoading: false,
  });

  const { refresh } = useRouter();
  const loadingClass = isLoading ? "pointer-event-none animate-pulse" : "";

  const changeName = async () => {
    if (initialName.toLocaleLowerCase() === name.toLocaleLowerCase()) return;
    updateObject("isLoading", true);
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
      updateObject("isLoading", false);
      return toast.error(response.message);
    }
    toast.success(response.message);
    refresh(), updateObject("isEdit", false);
  };

  const removeSong = async () => {
    const body = {
      songId: id,
      artistId,
    };
    updateObject("isLoading", false);
    const response: ErrorType = await fetch(`/api/song`, {
      method: "DELETE",
      body: JSON.stringify(body),
    }).then((res) => res.json());
    if (response.error) return toast.error(response.message);
    await deleteSong(urlSong);
    toast.success(response.message);
    refresh();
    updateObject("isLoading", false);
  };

  return (
    <>
      <Button
        onClick={(e) => {
          e.stopPropagation(), updateObject("isEdit", true);
        }}
        className="ml-auto  rounded-lg text-sm bg-white text-black"
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
              label=""
              classNameInput="bg-transparent border-gray-300 border-b-2"
              placeholder={name}
              value={name}
              onChange={(e) => updateObject("name", e.target.value)}
            />
            <span className="flex gap-2 ml-auto">
              <GiConfirmed
                onClick={changeName}
                className={`size-7 text-green-500 duration-150 ${loadingClass}`}
              />
              <GiCancel
                onClick={() => updateObject("isEdit", false)}
                className={`size-7  duration-150 ${loadingClass}`}
              />
              <RiDeleteBin6Line
                onClick={() => updateObject("isDelete", true)}
                className={`size-7  duration-150 ${loadingClass} text-red-500 `}
              />
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {isDelete && (
        <PopupDelete
          cancel={() => updateObject("isDelete", false)}
          confirm={removeSong}
          name={initialName}
          isLoading={isLoading}
        />
      )}
    </>
  );
}
