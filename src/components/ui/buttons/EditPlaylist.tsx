"use client";
import { FiEdit3 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import DeletePlaylist from "../custom/DeletePlaylist";

interface WithoutClickProps<T> extends Omit<React.HTMLProps<T>, "onClick"> {
  playlistId: string;
  playlistName: string;
}
interface DivProps extends WithoutClickProps<HTMLDivElement> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function EditPlaylist({
  playlistId,
  playlistName,
  ...props
}: DivProps) {
  const { onClick, className, ...rest } = props;

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);

  const defaultHeight =
    className?.includes("h") || className?.includes("size") ? "" : "h-7";
  return (
    <div
      {...rest}
      className={`${className ? "" : className} ${defaultHeight} flex gap-2`}
    >
      <AnimatePresence>
        {isEdit && (
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
        )}
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
