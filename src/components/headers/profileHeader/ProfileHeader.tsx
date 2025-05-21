"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import clsx from "clsx";
import { InputText, ExpandableText, EditableImage, PreviousPage } from "@/ui";

import { useSession } from "next-auth/react";
import { isAvailable, updateUser } from "@/utils/helpers";
import { toast } from "react-toastify";
import getVibrantColor from "@/utils/getVibrantColor";
import ToggleFollow from "./toggleFollow/ToggleFollow";

type ProfileInfo = {
  profileName: string;
  profileId: string;
  cover: string;
  vibrantColor?: { color: string; isLight: boolean };
};

interface ProfileHeaderProps {
  profileInfo: ProfileInfo;
  followersLength: number;
  username?: string;
  isArtist?: boolean;
  isInclude?: boolean;
  disableFollow?: boolean;
  artistAbout?: string;
}

export default function ProfileHeader({
  username,
  isArtist,
  artistAbout,
  isInclude,
  profileInfo,
  followersLength,
  disableFollow,
}: ProfileHeaderProps) {
  const { update } = useSession();
  const { refresh } = useRouter();
  const { profileName, profileId, cover, vibrantColor } = profileInfo;

  const [follows, setFollows] = useState(followersLength);
  const [vibrant, setVibrant] = useState(vibrantColor);

  const fetchVibrantColor = async (newImg?: string) => {
    const vibrantColor = await getVibrantColor(newImg || cover);
    setVibrant(vibrantColor);
    const body = {
      userId: profileId,
      vibrantColor,
    };

    await fetch(`/api/user`, { method: "PATCH", body: JSON.stringify(body) });
  };
  useEffect(() => {
    if (!vibrantColor) fetchVibrantColor();
  }, []);

  const isOwner = username === profileName;

  const onchange = useCallback(
    async (currValue: string) => {
      if (currValue === username) return;
      const available = await isAvailable(currValue);
      if (available.error) {
        toast.error(available.message);
        return;
      }
      if (available.response) {
        toast.error("Name not available");
        return;
      }
      const body = { userId: profileId, username: currValue };
      const updateName = await updateUser(body);
      if (updateName.error) {
        toast.error(updateName.message);
        return;
      }
      await update({ name: currValue });
      refresh();
    },
    [username, profileId, refresh, update]
  );

  const containerClasses = clsx(
    "w-full  relative md:flex flex-col items-center gap-3 md:items-start !bg-cover !bg-center p-4 md:rounded-t-xl",
    isArtist ? "md:min-h-[440px] lg:min-h-[480px]" : "md:min-h-[350px]"
  );

  const profileImgClass = clsx(
    "size-44 rounded-full",
    isArtist && "md:rounded-none md:w-full md:h-full md:brightness-75"
  );

  return (
    <div
      style={{
        background: `linear-gradient(to bottom, ${vibrant?.color} 0% ,transparent 100%)`,
      }}
      className={containerClasses}
    >
      <PreviousPage className={`md:z-10 ${isArtist ? "md:text-white" : ""}`} isLightBg={vibrant?.isLight} />

      <div className={`flex flex-col items-center mt-auto  ${isArtist ? "" : "md:p-4 md:flex-row"}`}>
        <div className={isArtist ? "md:absolute md:w-full md:top-0 md:left-0 md:h-full" : "mt-auto"}>
          <EditableImage
            className={profileImgClass}
            updateSession={!isArtist}
            updateVibrantColor={fetchVibrantColor}
            uploadUrl={isArtist ? "/api/artist" : `/api/user`}
            extraBody={{ userId: profileId }}
            fieldUpload={isArtist ? "cover" : "avatar"}
            initialValue={cover}
            isOwner={isOwner}
          />
        </div>

        <div
          className={`flex flex-col items-center gap-2  md:mt-16 md:items-start md:p-4 text-center md:text-left z-0`}
        >
          <InputText
            className="text-center md:text-left text-3xl md:text-5xl lg:text-6xl font-bold font-montserrat first-letter:uppercase"
            min={3}
            max={25}
            rows={1}
            changeable={isOwner}
            initialValue={profileName}
            onblur={(currValue: string) => onchange(currValue)}
          />

          {!disableFollow && (
            <div className="flex flex-col-reverse gap-1 items-center md:flex-row-reverse">
              {!isOwner && (
                <ToggleFollow
                  artistId={profileId}
                  handleFollows={(isFollowing: boolean) => {
                    setFollows((old) => (isFollowing ? old + 1 : old - 1));
                  }}
                  username={username}
                  initialValue={isInclude}
                />
              )}
              <span className="font-montserrat text-orange-300 md:font-semibold md:text-white md:text-lg lg:text-xl">
                {follows > 0 ? `${follows} ${follows > 1 ? "Follows" : "Follow"}` : "Be the first to follow"}
              </span>
            </div>
          )}
          {artistAbout && <ExpandableText className="hidden md:flex z-0">{artistAbout}</ExpandableText>}
        </div>
      </div>
    </div>
  );
}
