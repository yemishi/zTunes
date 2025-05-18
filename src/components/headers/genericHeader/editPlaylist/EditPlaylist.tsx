"use client";

import { FiEdit3 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { LuExpand } from "react-icons/lu";
import { MdPublic, MdPublicOff } from "react-icons/md";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Modal, PlaylistForm, PopConfirm } from "@/components";
import { cleanClasses } from "@/utils/helpers";
import { useQueryClient } from "@tanstack/react-query";
import { ErrorType } from "@/types/response";

interface WithoutClickProps<T> extends Omit<React.HTMLProps<T>, "onClick"> {
  playlistId: string;
  playlistName: string;
  username: string;
  isPublic?: boolean;
}
interface DivProps extends WithoutClickProps<HTMLDivElement> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  coverPhoto: string;
  name: string;
  categories?: string[];
  desc?: string;
}

export default function EditPlaylist({
  playlistId,
  playlistName,
  isPublic: isPlaylistPublic,
  username,
  name,
  coverPhoto,
  categories,
  desc,
  ...props
}: DivProps) {
  const { onClick, className, ...rest } = props;
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isPublic, setIsPublic] = useState(isPlaylistPublic);
  const [isForm, setIsForm] = useState(false);
  const queryClient = useQueryClient();
  const { refresh, back } = useRouter();

  const deletePlaylist = async () => {
    const response = await fetch(`/api/playlist`, {
      method: "DELETE",
      body: JSON.stringify({ playlistId }),
    }).then((res) => res.json());
    if (response.error) return toast.error(response.message);
    await queryClient.invalidateQueries({
      queryKey: ["User playlists", username],
    });
    close();
    back();
    refresh();
  };

  const toggleVisible = async () => {
    await fetch(`/api/playlist`, {
      method: "PATCH",
      body: JSON.stringify({ id: playlistId, isPublic: !!!isPublic }),
    }).then((res) => res.json());
    setIsPublic(!!!isPublic);
  };
  const variants = {
    initial: { x: 20, opacity: 0, scale: 0.95 },
    animate: { x: 0, opacity: 1, scale: 1 },
    exit: { x: 20, opacity: 0, scale: 0.95 },
  };

  const transition = {
    type: "spring",
    stiffness: 260,
    damping: 20,
    duration: 0.3,
  };
  return (
    <div {...rest} className={cleanClasses(className, "flex gap-2 h-7")}>
      {isForm && (
        <Modal className="modal-container !overflow-y-auto" onClose={() => setIsForm(false)}>
          <PlaylistForm
            formInfo={{ coverPhoto, desc, isPublic, name, categories }}
            id={playlistId}
            username={username}
            onClose={() => setIsForm(false)}
          />
        </Modal>
      )}
      <AnimatePresence mode="wait">
        {isEdit && (
          <>
            <motion.button
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              transition={transition}
              onClick={() => setIsDelete(true)}
              className="size-full cursor-pointer"
            >
              <RiDeleteBin6Line className="size-full" />
            </motion.button>
            <motion.button
              className="size-full cursor-pointer"
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
              variants={variants}
              onClick={toggleVisible}
            >
              {isPublic ? <MdPublic className="size-full" /> : <MdPublicOff className="size-full" />}
            </motion.button>
            <motion.button
              className="size-full cursor-pointer"
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
              variants={variants}
              onClick={() => setIsForm(true)}
            >
              <LuExpand className="size-full" />
            </motion.button>
          </>
        )}
      </AnimatePresence>

      <button
        className="size-full cursor-pointer hover:brightness-110 transition-all brightness-90"
        onClick={(e) => {
          setIsEdit(!isEdit), onClick && onClick(e);
        }}
      >
        <FiEdit3 className="size-full" />
      </button>

      {isDelete && <PopConfirm confirm={deletePlaylist} name={playlistName} onClose={() => setIsDelete(false)} />}
    </div>
  );
}
