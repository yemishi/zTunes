"use client";

import { lazy, useEffect, useState } from "react";
import Image from "../ui/custom/Image";
import Button from "../ui/buttons/Button";
import { Playlist } from "@prisma/client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
const ForceAddToPlaylist = lazy(() => import("./forceAddToPlaylist"));

export default function AddToPlaylist({
  options,
  onclose,
  userAvatar,
  username,
}: {
  options: {
    songSelected: { songId: string; createdAt: Date };
    coverPhoto: string;
    title: string;
  };
  onclose: () => void;
  username: string | undefined;
  userAvatar: string | undefined;
}) {
  const [playlists, setPlaylists] = useState<Playlist[]>();
  const { refresh } = useRouter();
  const [forcePush, setForcePush] = useState<{
    playlistId: string;
    username: string;
    songSelected: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data: { playlists: Playlist[]; hasMore: boolean } = await fetch(
        `/api/playlist?username=${username}&authorName=${username}&limit=10`
      ).then((res) => res.json());
      setPlaylists(data.playlists);
    };
    fetchData();
  }, [options]);

  const { songSelected, title } = options;
  const { songId } = songSelected;

  const addSong = async (id: string) => {
    const data = await fetch(`/api/playlist`, {
      method: "PATCH",
      body: JSON.stringify({ id, songSelected: songId }),
    }).then((res) => res.json());
    if (!data.error) {
      refresh();
      onclose();
      return toast.success(data.message);
    }
    if (data.alreadyIn && username) {
      refresh();
      return setForcePush({
        playlistId: id,
        songSelected: songId,
        username,
      });
    }
    toast.error(data.message);
  };

  const newPlaylist = async () => {
    const body = {
      coverPhoto:
        "https://firebasestorage.googleapis.com/v0/b/ztunes-695af.appspot.com/o/default%2FplaylistDefault.jpg?alt=media&token=c2e0c6a3-8c62-4154-a729-67d335fb1855",
      username,
      title,
      songs: [{ createdAt: new Date(), songId }],
    };
    const newPlaylist = await fetch(`/api/playlist`, {
      method: "POST",
      body: JSON.stringify(body),
    }).then((res) => res.json());
    if (newPlaylist.error) return toast.error(newPlaylist.message);
    toast.success(newPlaylist.message);
    onclose();
  };
  return (
    <div className="h-full w-full font-kanit bg-black bg-opacity-85 p-4 pt-20 md:pt-3 flex flex-col md:max-w-[550px] md:max-h-[800px] md:rounded-lg">
      <div className="flex flex-col gap-5 mb-7 self-center items-center">
        <Image
          src={userAvatar as string}
          className="size-28 md:size-40 rounded-lg"
        />
        <span className="flex flex-col">
          <span className="text-2xl first-letter:uppercase">{username}</span>
        </span>
      </div>

      <div className="flex flex-col p-4 gap-5 overflow-y-auto">
        <span className="text-xl">Your playlists</span>
        <Button
          onClick={newPlaylist}
          type="button"
          className="sticky ml-auto top-0 z-10 bg-white text-black rounded-lg"
        >
          New playlist
        </Button>

        {playlists &&
          playlists.map((playlist, index) => {
            const { coverPhoto, id, songs, title } = playlist;
            return (
              <div
                key={`${id}_${index}`}
                onClick={() => addSong(id)}
                className="flex gap-2 cursor-pointer hover:bg-black-450 active:bg-black-300 items-center"
              >
                <Image src={coverPhoto} className="size-14 md:size-20" />
                <div className="flex flex-col  md:text-lg py-1">
                  <span>{title}</span>
                  <span className="text-white opacity-60">
                    {songs.length} songs
                  </span>
                </div>
              </div>
            );
          })}
      </div>
      <Button
        onClick={onclose}
        className="mt-auto mb-14 md:self-center md:mb-2 md:text-lg"
      >
        Close
      </Button>
      {forcePush && (
        <ForceAddToPlaylist
          goBack={() => setForcePush(null)}
          onclose={onclose}
          forcePush={forcePush}
        />
      )}
    </div>
  );
}
