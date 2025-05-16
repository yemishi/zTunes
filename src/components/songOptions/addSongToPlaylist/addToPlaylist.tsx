"use client";

import { useState } from "react";
import Image from "@/ui/custom/Image";
import { toast } from "react-toastify";
import useScrollQuery from "@/hooks/useScrollQuery";
import { PlaylistType } from "@/types/response";
import ErrorWrapper from "../../errorWrapper/ErrorWrapper";
import { PopConfirm } from "../..";
import { useQueryClient } from "@tanstack/react-query";

export default function AddSongToPlaylist({
  songId,
  onClose,
  refresh,
  username,
  vibrantColor,
}: {
  songId: string;
  username: string;
  onClose: () => void;
  refresh?: () => void;
  vibrantColor?: { color: string; isLight: boolean };
}) {
  const [forceInsert, setForceInsert] = useState<{
    id: string;
    username: string;
    songSelected: string;
  } | null>(null);
  const queryClient = useQueryClient();
  const {
    values: playlists,
    ref,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
  } = useScrollQuery<PlaylistType>({
    queryKey: ["User playlists", username],
    url: `/api/playlist?authorName=${username}&username=${username}`,
  });

  const addSong = async (id: string) => {
    const data = await fetch(`/api/playlist`, {
      method: "PATCH",
      body: JSON.stringify({ id, songSelected: songId }),
    }).then((res) => res.json());
    if (!data.error) {
      queryClient.invalidateQueries({
        queryKey: ["User playlists", username],
      });
      if (refresh) refresh();
      onClose();
      toast.success(data.message);
      return;
    }
    if (data.alreadyIn) {
      if (refresh) refresh();
      return setForceInsert({ username, id, songSelected: songId });
    }
    toast.error(data.message);
  };

  const forceInsertSong = async () => {
    const body = { ...forceInsert, force: true };
    const data = await fetch(`/api/playlist`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }).then((res) => res.json());
    if (refresh) refresh();
    if (data.error) return toast.error(data.message);
    queryClient.invalidateQueries({
      queryKey: ["User playlists", username],
    });
    toast.success(data.message);
    onClose();
  };
  return (
    <li
      style={{ background: vibrantColor ? vibrantColor.color : "#2f2f2f " }}
      className={` flex flex-col p-2 gap-2 md:text-lg max-h-80 rounded-md w-52 absolute z-10 right-50 -top-1 shadow-lg shadow-black`}
    >
      <ErrorWrapper error={isError || !!error} message={error?.message}>
        <ul className="overflow-y-auto">
          {playlists &&
            playlists.map((playlist, index) => {
              const { coverPhoto, id, title } = playlist;

              return (
                <li
                  key={`${id}_${index}`}
                  onClick={() => addSong(id)}
                  className="flex gap-2 items-center p-2 hover:backdrop-brightness-150 rounded-md active:backdrop-brightness-50 w-full cursor-pointer"
                >
                  <Image src={coverPhoto} className="size-8 rounded-full" />{" "}
                  <span className="line-clamp-1">{title}</span>
                </li>
              );
            })}
          {!isFetchingNextPage && hasNextPage && <div ref={ref} />}
          {isFetchingNextPage && <div className="spinner" />}
        </ul>
      </ErrorWrapper>

      {forceInsert && (
        <PopConfirm
          confirm={forceInsertSong}
          onClose={() => setForceInsert(null)}
          desc="This playlist already have this song"
          confirmDesc="Add anyway"
        />
      )}
    </li>
  );
}
