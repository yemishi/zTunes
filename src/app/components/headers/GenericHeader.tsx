"use client";
import { HTMLAttributes, useEffect, useState } from "react";
import Image from "../ui/Image";
import PreviousPage from "../ui/PreviousPage";
import Link from "next/link";
import { SongType } from "@/types/response";
import { formatDuration } from "@/app/utils/formatting";

interface DivProps extends HTMLAttributes<HTMLDivElement> {
  info: {
    avatar: string;
    title: string;
    author: string;
    coverPhoto: string;
    id: string;
    releasedDate?: string;
    desc?: string;
    isUser?: Boolean;
    isOfficial?: boolean;
  };

  bgFrom: string;
  songs: SongType[];
}

export default function GenericHeader({
  songs,
  bgFrom,
  info,
  ...props
}: DivProps) {
  const {
    author,
    avatar,
    title,
    coverPhoto,
    desc,
    releasedDate,
    id,
    isUser,
    isOfficial,
  } = info;
  const [duration, setDuration] = useState<string>();

  const getSongDuration = async (urlSong: string) => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.addEventListener("loadedmetadata", () => {
        resolve(Math.floor(audio.duration));
      });
      audio.src = urlSong;
      audio.load();
    });
  };

  const durationPromises = songs.map((song) => getSongDuration(song.urlSong));

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
  }, [songs]);

  return (
    <div
      {...props}
      style={{
        background: `linear-gradient(to bottom,${bgFrom} 10% ,transparent 100%)`,
      }}
      className={`${props.className ? props.className : ""}
    flex flex-col gap-2 items-center w-full p-4 pt-0 pb-10`}
    >
      <PreviousPage />
      <Image
        src={coverPhoto}
        className="size-44 rounded-lg shadow-lg object-cover"
      />

      <span className="flex flex-col items-center font-kanit">
        <h1 className="text-3xl font-medium mt-3 line-clamp-2">{title}</h1>
        {releasedDate && <span className="font-light">{releasedDate}</span>}
      </span>

      {isOfficial ? (
        <div className="self-start flex items-center gap-2 mt-2">
          <span>
            <Image src={avatar} className="size-7 rounded-full" />
          </span>
          <p className="first-letter:uppercase font-kanit text-sm">{author}</p>
        </div>
      ) : (
        <Link
          href={`${isUser ? "/user" : "/artist"}/${id}`}
          className="self-start flex items-center gap-2 mt-2"
        >
          <span>
            <Image src={avatar} className="size-7 rounded-full" />
          </span>
          <p className="first-letter:uppercase font-kanit text-sm">{author}</p>
        </Link>
      )}

      <div className="self-start flex  text-sm font-kanit gap-1 text-opacity-70 text-white">
        <p>{duration}</p>•<p>{songs.length} songs</p>
      </div>
      {desc && <p className="line-clamp-3">{desc}</p>}
    </div>
  );
}
