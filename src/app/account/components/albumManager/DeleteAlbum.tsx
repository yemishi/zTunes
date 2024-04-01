"use client";

import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ErrorType } from "@/types/response";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import PopupDelete from "../PopupDelete";

export default function DeleteAlbum({
  albumId,
  title,
}: {
  title: string;
  albumId: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const { refresh, push } = useRouter();

  const deleteAlbum = async () => {
    setIsLoading(true);
    const response: ErrorType = await fetch("/api/album", {
      method: "DELETE",
      body: JSON.stringify({ albumId }),
    }).then((res) => res.json());
    if (response.error) return toast.error(response.message);
    toast.success(response.message);
    setIsDelete(false), push("/account");
    return refresh();
  };
  return (
    <>
      <RiDeleteBin6Line
        onClick={() => setIsDelete(true)}
        className={`size-7 duration-150  absolute top-4 right-4 cursor-pointer`}
      />
      {isDelete && (
        <PopupDelete
          name={title}
          confirm={deleteAlbum}
          isLoading={isLoading}
          cancel={() => setIsDelete(false)}
        />
      )}
    </>
  );
}
