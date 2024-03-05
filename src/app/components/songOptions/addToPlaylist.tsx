"use client";

import { lazy, useEffect, useState } from "react";
import Image from "../ui/Image";
import Button from "../ui/Button";
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
      const data: Playlist[] = await fetch(
        `/api/playlist?username=${username}&author=${username}`
      ).then((res) => res.json());
      setPlaylists(data);
    };
    fetchData();
  }, [options]);

  const { coverPhoto, songSelected, title } = options;
  const { songId } = songSelected;

  const addSong = async (id: string) => {
    const body = {
      id,
      songSelected: songId,
    };
    const data = await fetch(`/api/playlist`, {
      method: "PATCH",
      body: JSON.stringify(body),
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
      coverPhoto,
      username,
      title,
      addSongs: [{ createdAt: new Date(), songId }],
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
    <div className="fixed h-full w-full font-kanit top-0 left-0 backdrop-blur-lg backdrop-brightness-50 p-4 pt-20 flex flex-col z-10">
      <div className="flex flex-col gap-5 mb-7 self-center items-center">
        <span className="self-center text-3xl">Save to playlist</span>
        <Image src={userAvatar as string} className="size-28 rounded-lg" />
        <span className="flex flex-col">
          <span className="text-2xl first-letter:uppercase">{username}</span>
        </span>
      </div>

      <div className="flex flex-col p-4 gap-5 overflow-y-scroll">
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
                className="flex gap-2 py-1"
              >
                <Image src={coverPhoto} className="size-14" />
                <div className="flex flex-col">
                  <span>{title}</span>
                  <span className="text-white opacity-60">
                    {songs.length} songs
                  </span>
                </div>
              </div>
            );
          })}
      </div>
      <Button onClick={onclose} className="mt-auto mb-14">
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
