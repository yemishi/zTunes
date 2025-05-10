"use client";

import { FiEdit3 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { MdPublic, MdPublicOff } from "react-icons/md";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { PopConfirm } from "@/components";
import { cleanClasses } from "@/utils/helpers";
import { useQueryClient } from "@tanstack/react-query";

interface WithoutClickProps<T> extends Omit<React.HTMLProps<T>, "onClick"> {
  playlistId: string;
  playlistName: string;
  username: string;
  isPublic?: boolean;
}
interface DivProps extends WithoutClickProps<HTMLDivElement> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function EditPlaylist({
  playlistId,
  playlistName,
  isPublic: isPlaylistPublic,
  username,
  ...props
}: DivProps) {
  const { onClick, className, ...rest } = props;
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isPublic, setIsPublic] = useState(isPlaylistPublic);
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
