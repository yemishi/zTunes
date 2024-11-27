"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "../ui/buttons/Button";
import { useRouter } from "next/navigation";

import clsx from "clsx";
import PreviousPage from "../ui/buttons/PreviousPage";
import EditableImage from "../ui/custom/EditableImage";
import InputText from "../ui/inputs/InputText";

import { useSession } from "next-auth/react";
import { isAvailable, updateUser } from "@/utils/fnc";
import { toast } from "react-toastify";
import checkDev from "@/utils/isMobile";
import { FaHeart } from "react-icons/fa6";
import ExpandableText from "../ui/custom/ExpandableText";

type ProfileInfo = {
  profileName: string;
  profileId: string;
  cover: string;
};

interface ProfileHeaderProps {
  username: string;
  profileInfo: ProfileInfo;
  followersLength: number;
  isArtist?: boolean;
  isInclude?: boolean;
  artistAbout?: string;
}

export default function ProfileHeader({
  username,
  isArtist,
  artistAbout,
  isInclude,
  profileInfo,
  followersLength,
}: ProfileHeaderProps) {
  const { profileName, profileId, cover } = profileInfo;
  const [isFollow, setIsFollow] = useState<boolean>(!!isInclude);
  const [follows, setFollows] = useState<number>(followersLength);
  const [vibrantColor, setVibrantColor] = useState("transparent")
  const { push, refresh } = useRouter();
  const { update } = useSession();
  const isMobile = checkDev();

  useEffect(() => {
    const fetchVibrantColor = async () => {
      if (isMobile || !isArtist) {
        const vibrantColor = await fetch(`/api/vibrant-color?imgUrl=${encodeURI(cover)}`).then((res) => res.json());
        setVibrantColor(vibrantColor);
      }
    }; fetchVibrantColor();
  }, [cover, isArtist, isMobile]);

  const fetchFollow = async () => {
    const newFollowState = !isFollow;
    setIsFollow(newFollowState);
    setFollows((prev) => (newFollowState ? prev + 1 : prev - 1));

    const body = { username, artistId: profileId, };

    await fetch(`/api/followers`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }).catch(() => {
      setIsFollow(!newFollowState);
      setFollows((prev) => (newFollowState ? prev - 1 : prev + 1));
    })
  };

  const isOwner = username === profileName;

  const onchange = useCallback(async (currValue: string) => {
    if (currValue === username) return;
    const available = await isAvailable(currValue);
    if (available.error) { toast.error(available.message); return; }
    if (available.response) { toast.error("Name not available"); return; }
    const body = { userId: profileId, username: currValue };
    const updateName = await updateUser(body);
    if (updateName.error) {
      toast.error(updateName.message)
      return;
    }
    await update({ name: currValue })
    refresh();
  },
    [username, profileId, refresh, update]);

  const containerClasses = clsx(
    "w-full relative flex flex-col items-center gap-3 md:items-start !bg-cover !bg-center",
    isArtist ? "md:min-h-[440px] lg:min-h-[480px]" : "md:min-h-[350px]"
  );

  const profileImgClass = clsx(
    "size-44 rounded-full",
    isArtist && "md:rounded-none md:w-full md:h-full md:brightness-75"
  );

  return (
    <div
      style={{
        background:
          isMobile || !isArtist
            ? `linear-gradient(to bottom,${vibrantColor} 0% ,transparent 100%)`
            : "",
      }}
      className={containerClasses}
    >
      <PreviousPage className="p-4 md:z-10" />

      <div
        className={`flex flex-col items-center mt-auto ${isArtist ? "" : "md:p-4 md:flex-row"
          }`}
      >
        <div
          className={
            isArtist
              ? "md:absolute md:w-full md:top-0 md:left-0 md:h-full"
              : "mt-auto"
          }
        >
          <EditableImage
            className={profileImgClass}
            updateSession={!isArtist}
            uploadUrl={isArtist ? "/api/artist" : `/api/user`}
            extraBody={{ userId: profileId }}
            fieldUpload={isArtist ? "cover" : "avatar"}
            initialValue={cover}
            isOwner={isOwner}
          />
        </div>

        <div
          className={`flex flex-col items-center gap-2 md:z-10 md:mt-16 md:items-start md:p-4 text-center md:text-left`}
        >
          <InputText
            className="text-center md:text-left text-3xl md:text-5xl lg:text-6xl font-bold font-montserrat first-letter:uppercase"
            min={3}
            max={25}
            rows={isMobile ? 1 : 2}
            changeable={isOwner}
            initialValue={profileName}
            onblur={(currValue: string) => onchange(currValue)}
          />

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            {follows > 0 && (
              <span className="font-montserrat text-orange-300 md:font-semibold md:text-white md:text-lg lg:text-xl">
                {follows} Follows
              </span>
            )}

            {!isOwner &&
              (isMobile || !isArtist ? (
                <Button
                  onClick={() => (username ? fetchFollow() : push("/sign-in"))}
                  className="bg-transparent py-1 text-base md:z-10"
                >
                  {isFollow ? "unfollow" : "Follow"}
                </Button>
              ) : (
                <FaHeart
                  onClick={() => (username ? fetchFollow() : push("/sign-in"))}
                  className={`size-9 cursor-pointer duration-150 z-10  ${isFollow ? "text-amber-500" : "text-white text-opacity-30"
                    }`}
                />
              ))}
          </div>
          {artistAbout && !isMobile && (
            <ExpandableText>{artistAbout}</ExpandableText>
          )}
        </div>
      </div>
    </div>
  );
}
