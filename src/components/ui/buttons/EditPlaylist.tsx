"use client";
import { FiEdit3 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { useState } from "react";
import DeletePlaylist from "../custom/DeletePlaylist";
import { MdPublic, MdPublicOff } from "react-icons/md";

interface WithoutClickProps<T> extends Omit<React.HTMLProps<T>, "onClick"> {
  playlistId: string;
  playlistName: string;
  username: string;
  isPublic?: boolean
}
interface DivProps extends WithoutClickProps<HTMLDivElement> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function EditPlaylist({
  playlistId,
  playlistName,
  isPublic: isPlaylistPublic, username,
  ...props
}: DivProps) {
  const { onClick, className, ...rest } = props;

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isPublic, setIsPublic] = useState(isPlaylistPublic)

  const toggleVisible = async () => {
    await fetch(`/api/playlist`, {
      method: "PATCH",
      body: JSON.stringify({ id: playlistId, isPublic: !!!isPublic }),
    }).then((res) => res.json());
    setIsPublic(!!!isPublic)
  }

  const defaultHeight =
    className?.includes("h") || className?.includes("size") ? "" : "h-7";
  return (
    <div
      {...rest}
      className={`${className ? "" : className} ${defaultHeight} flex gap-2`}
    >
      <AnimatePresence>
        {isEdit &&
          <>
            <motion.span
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsDelete(true)}
              className="h-full w-full"
            >
              <RiDeleteBin6Line className="h-full w-full cursor-pointer" />
            </motion.span>
            <motion.button
              className="h-full w-full"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={toggleVisible}
            >
              {isPublic ? <MdPublic className="h-full w-full cursor-pointer text-white" /> : <MdPublicOff className="h-full w-full cursor-pointer text-white" />}

            </motion.button>
          </>}
      </AnimatePresence>



      <button
        className="h-full w-full"
        onClick={(e) => {
          setIsEdit(!isEdit), onClick && onClick(e);
        }}
      >
        <FiEdit3 className="h-full w-full cursor-pointer text-white" />
      </button>

      {isDelete && (
        <DeletePlaylist
          close={() => setIsDelete(false)}
          playlistId={playlistId}
          playlistName={playlistName}
        />
      )}
    </div>
  );
}
