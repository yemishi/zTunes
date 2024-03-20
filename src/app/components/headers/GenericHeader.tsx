"use client";

import { HTMLAttributes, useEffect, useState } from "react";
import { formatDuration } from "@/app/utils/formatting";
import { SongType } from "@/types/response";

import Image from "../ui/Image";
import Link from "next/link";

import PreviousPage from "../ui/buttons/PreviousPage";
import InputText from "../ui/inputs/InputText";
import EditableImage from "../ui/EditableImage";
import EditPlaylist from "../ui/buttons/EditPlaylist";

export default function GenericHeader({
  songs,
  info,
  playlistId,
  updateUrl,
  ...props
}: DivProps) {
  const {
    author,
    avatar,
    title,
    isOwner,
    coverPhoto,
    desc,
    releasedDate,
    authorId,
    isUser,
  } = info;

  const [duration, setDuration] = useState<string>();

  const durationPromises = songs.map((song) => getSongDuration(song.urlSong));

  const [vibrantColor, setVibrantColor] = useState<string>();

  useEffect(() => {
    Promise.all(durationPromises)
      .then((durations) => {
        const totalInSeconds = durations.reduce(
          (pre, curr) => Number(pre) + Number(curr),
          0
        ) as number;
        const formattedDuration = formatDuration(totalInSeconds);
        setDuration(formattedDuration);
      })
      .catch(() => setDuration("0s"));

    const fetchVibrantColor = async () => {
      const vibrantColor = await fetch(
        `/api/vibrant-color?imgUrl=${encodeURI(coverPhoto)}`
      ).then((res) => res.json());
      setVibrantColor(vibrantColor);
    };
    fetchVibrantColor();
  }, [songs]);

  return (
    <div
      {...props}
      style={{
        background: `linear-gradient(to bottom,${vibrantColor} 10%,transparent 100%)`,
      }}
      className={`${
        props.className ? props.className : ""
      } flex flex-col gap-2 items-center w-full p-4 pt-0 pb-10`}
    >
      <span className="flex items-center py-4 justify-between w-full">
        <PreviousPage className="p-0" />
        {isOwner && playlistId && (
          <EditPlaylist
            playlistId={playlistId as string}
            playlistName={title}
          />
        )}
      </span>

      <EditableImage
        className="rounded-lg"
        fieldUpload="coverPhoto"
        initialValue={coverPhoto}
        isOwner={isOwner}
        uploadUrl={updateUrl || "/api/playlist"}
        extraBody={{ id: playlistId }}
      />

      <span className="flex flex-col items-center font-kanit max-w-56 text-center">
        <InputText
          extraBody={{ id: playlistId }}
          initialValue={title}
          fieldType="title"
          changeable={isOwner}
          patchUrl={updateUrl || "/api/playlist"}
        />
        {releasedDate && <span className="font-light">{releasedDate}</span>}
      </span>

      <Link
        href={`${`${isUser ? "/user" : "/artist"}`}/${authorId}`}
        className="self-start flex items-center gap-2 mt-2"
      >
        <span>
          <Image src={avatar} className="size-7 rounded-full" />
        </span>
        <p className="first-letter:uppercase font-kanit text-sm">{author}</p>
      </Link>
      <div className="self-start flex  text-sm font-kanit gap-1 text-opacity-70 text-white">
        <p>{duration}</p>•<p>{songs.length} songs</p>
      </div>
      {desc && <p className="line-clamp-3 self-start">{desc}</p>}
    </div>
  );
}

async function getSongDuration(urlSong: string) {
  if (typeof window !== "undefined") {
    return new Promise((resolve) => {
      const audio = new Audio(urlSong);
      audio.addEventListener("loadedmetadata", () => {
        resolve(Math.floor(audio.duration));
      });

      audio.load();
    });
  }
  return 0;
}

interface DivProps extends HTMLAttributes<HTMLDivElement> {
  info: InfoType;
  songs: SongType[];
  playlistId?: string;
  updateUrl?: string;
}

type InfoType = {
  avatar: string;
  title: string;
  author: string;
  coverPhoto: string;
  authorId: string;
  isOwner: boolean;
  desc?: string;
  isUser?: Boolean;
  isOfficial?: boolean;
  releasedDate?: string;
};
