"use client";

import { HTMLAttributes, useEffect, useState } from "react";
import { formatDuration } from "@/utils/formatting";
import { SongType } from "@/types/response";

import Image from "../ui/custom/Image";
import Link from "next/link";

import PreviousPage from "../ui/buttons/PreviousPage";
import InputText from "../ui/inputs/InputText";
import EditableImage from "../ui/custom/EditableImage";
import EditPlaylist from "../ui/buttons/EditPlaylist";
import ExpandableText from "../ui/custom/ExpandableText";
import { getSongDuration } from "@/utils/fnc";

export default function GenericHeader({
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
    urlsSongs,
  } = info;

  const { className, ...rest } = props;
  const [duration, setDuration] = useState<string>();
  const durationPromises = urlsSongs.map((url) => getSongDuration(url));
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
  }, []);

  return (
    <div
      {...rest}
      style={{
        background: `linear-gradient(to bottom,${vibrantColor} 10%,transparent 100%)`,
      }}
      className={`${
        className ? className : ""
      } flex flex-col gap-2 h-full items-center w-full p-4 pt-0 pb-10 md:min-h-[350px] md:items-start`}
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

      <div className="flex flex-col md:p-4 md:flex-row w-full items-start gap-3">
        <EditableImage
          className="rounded-lg size-44 md:size-52 self-center md:self-start"
          fieldUpload="coverPhoto"
          initialValue={coverPhoto}
          isOwner={isOwner}
          uploadUrl={updateUrl || "/api/playlist"}
          extraBody={{ id: playlistId }}
        />

        <div className="md:mt-auto flex flex-col w-full md:w-auto">
          <span className="self-center text-center md:self-start max-w-56 md:max-w-full md:text-start md:pb-4 ">
            <InputText
              className="text-center md:text-left text-3xl md:text-5xl lg:text-6xl font-bold font-montserrat first-letter:uppercase"
              extraBody={{ id: playlistId }}
              initialValue={title}
              fieldType="title"
              changeable={isOwner}
              patchUrl={updateUrl || "/api/playlist"}
            />
            {releasedDate && (
              <span className="font-light text-orange-300 md:hidden font-kanit">
                {releasedDate}
              </span>
            )}
          </span>

          <span className="flex flex-col gap-1 md:flex-row  md:items-center md:gap-2 font-kanit text-sm md:text-base ">
            <Link
              href={`${`${isUser ? "/user" : "/artist"}`}/${authorId}`}
              className="flex items-center gap-2 "
            >
              <span>
                <Image
                  src={avatar}
                  className="size-7 md:size-10 rounded-full"
                />
              </span>
              <p className="first-letter:uppercase md:font-semibold">
                {author}
              </p>
            </Link>
            <span className="hidden md:block">
              • {releasedDate?.split("/")[2]} •
            </span>
            <div className="flex gap-1 text-opacity-70 text-white md:text-opacity-100">
              <span>{duration}</span>•<span>{urlsSongs.length} songs</span>
            </div>
          </span>

          {desc && <ExpandableText className="md:mt-2">{desc}</ExpandableText>}
        </div>
      </div>
    </div>
  );
}

interface DivProps extends HTMLAttributes<HTMLDivElement> {
  info: InfoType;
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
  urlsSongs: string[];
};
