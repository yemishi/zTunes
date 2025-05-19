"use client";

import { HTMLAttributes, useEffect, useState } from "react";

import Image from "@/ui/custom/Image";
import Link from "next/link";

import PreviousPage from "@/ui/buttons/PreviousPage";
import { InputText } from "@/ui";
import EditableImage from "@/ui/custom/EditableImage";
import EditPlaylist from "./editPlaylist/EditPlaylist";
import ExpandableText from "@/ui/custom/ExpandableText";
import getVibrantColor from "@/utils/getVibrantColor";
import { useQueryClient } from "@tanstack/react-query";
import { cleanClasses } from "@/utils/helpers";
import { formatDuration } from "@/utils/formatting";
export default function GenericHeader({
  info,
  playlistId,
  updateUrl = "/api/playlist",
  username,
  extraBody = { id: playlistId },
  onUpdateText,
  vibrantColor,
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
    isPublic,
    authorId,
    isOfficial,
    categories,
    isUser,
    tracks,
  } = info;
  const { className, ...rest } = props;
  const [vibrant, setVibrant] = useState(vibrantColor);

  const queryClient = useQueryClient();
  const refetchUserPlaylists = async () => {
    if (!playlistId) return;
    await queryClient.invalidateQueries({
      queryKey: ["User playlists", username],
    });
  };
  const updateVibrantColor = async (img: string) => {
    const vibrantColor = await getVibrantColor(img);
    setVibrant(vibrantColor);
    const body = {
      ...extraBody,
      vibrantColor,
    };

    await fetch(updateUrl, { method: "PATCH", body: JSON.stringify(body) });
  };
  useEffect(() => {
    if (!vibrant) updateVibrantColor(coverPhoto);
  }, []);

  const totalDuration = tracks.reduce((pre, curr) => Number(pre) + Number(curr.duration), 0);
  return (
    <div
      {...rest}
      style={{
        background: `linear-gradient(to bottom,${vibrant?.color} 10%,transparent 100%)`,
      }}
      className={cleanClasses(
        className,
        "flex flex-col gap-2 md:rounded-t-xl h-full items-center w-full p-4 pt-0 pb-10 md:min-h-[350px] md:items-start"
      )}
    >
      <span
        className={`flex items-center py-4 justify-between w-full ${vibrant?.isLight ? "text-black" : "text-white"}`}
      >
        <PreviousPage isLightBg={vibrant?.isLight} />
        {isOwner && playlistId && (
          <EditPlaylist
            name={title}
            desc={desc}
            username={username as string}
            playlistId={playlistId as string}
            playlistName={title}
            isPublic={isPublic}
            categories={categories}
            coverPhoto={coverPhoto}
          />
        )}
      </span>

      <div className="flex flex-col md:p-4 md:flex-row w-full items-start gap-3">
        <EditableImage
          className="rounded-lg size-44 md:size-52 self-center md:self-start"
          fieldUpload="coverPhoto"
          initialValue={coverPhoto}
          updateVibrantColor={updateVibrantColor}
          onSuccess={refetchUserPlaylists}
          isOwner={isOwner}
          uploadUrl={updateUrl}
          extraBody={extraBody}
        />

        <div className="md:mt-auto flex flex-col w-full md:w-auto">
          <span className="self-center text-center md:self-start max-w-56 md:max-w-full md:text-start md:pb-4 ">
            <InputText
              className="text-center md:text-left text-3xl md:text-5xl lg:text-6xl font-bold font-montserrat first-letter:uppercase"
              extraBody={extraBody}
              initialValue={title}
              onSuccess={refetchUserPlaylists}
              fieldType="title"
              changeable={isOwner}
              patchUrl={updateUrl}
            />
            {releasedDate && <span className="font-light text-orange-300 md:hidden font-kanit">{releasedDate}</span>}
          </span>

          <span className="flex flex-col gap-1 md:flex-row  md:items-center md:gap-2 font-kanit text-sm md:text-base">
            {isOfficial ? (
              <div className="flex items-center gap-2 ">
                <Image src="/favIcon.svg" className="size-7  md:size-10 rounded-full" />
                <p className="md:font-semibold">zTunes</p>
              </div>
            ) : (
              <Link href={`${`${isUser ? "/user" : "/artist"}`}/${authorId}`} className="flex items-center gap-2">
                <span>
                  <Image src={avatar} className="size-7  md:size-10 rounded-full" />
                </span>
                <p className="first-letter:uppercase md:font-semibold">{author}</p>
              </Link>
            )}

            <span className="hidden md:block">• {releasedDate?.split("/")[2]} •</span>
            <div className="flex gap-1 text-opacity-70 text-white md:text-opacity-100">
              <span>{formatDuration(totalDuration)}</span>•<span>{tracks.length} songs</span>
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
  vibrantColor: { color: string; isLight: boolean };
  username?: string;
  playlistId?: string;

  updateUrl?: string;
  onUpdateText?: () => void;
  extraBody?: {};
}

type InfoType = {
  avatar: string;
  title: string;
  author: string;
  coverPhoto: string;
  authorId: string;
  isOwner: boolean;
  username?: string;
  isPublic?: boolean;
  desc?: string;
  isUser?: Boolean;
  isOfficial?: boolean;
  categories?: string[];
  releasedDate?: string;
  tracks: { url: string; duration: number }[];
};
