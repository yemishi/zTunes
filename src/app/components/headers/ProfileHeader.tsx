"use client";

import { useState } from "react";
import Button from "../ui/buttons/Button";
import { useRouter } from "next/navigation";
import PreviousPage from "../ui/buttons/PreviousPage";
import EditableImage from "../ui/EditableImage";
import InputText from "../ui/inputs/InputText";
import { useSession } from "next-auth/react";
import { isAvailable, updateUser } from "@/app/utils/fnc";
import { toast } from "react-toastify";

type ProfileInfo = {
  profileName: string;
  profileId: string;
  cover: string;
};
export default function ProfileHeader({
  username,
  isArtist,
  isInclude,
  profileInfo,
  vibrantColor,
  followersLength,
}: {
  username: string;
  vibrantColor: string;
  profileInfo: ProfileInfo;
  followersLength: number;
  isArtist?: boolean;
  isInclude?: boolean;
}) {
  const { profileName, profileId, cover } = profileInfo;
  const [isFollow, setIsFollow] = useState<boolean>(!!isInclude);
  const [follows, setFollows] = useState<number>(followersLength);

  const { push, refresh } = useRouter();
  const { update } = useSession();

  const fetchFollow = async () => {
    setIsFollow(!isFollow);
    const body = {
      username,
      artistId: profileId,
    };
    await fetch(`/api/followers`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });

    const data = await fetch(
      `/api/followers?artistId=${profileId}&username=${username}`
    ).then((res) => res.json());
    setFollows(data.length);
  };
  const isOwner = username === profileName;

  const onchange = async (currValue: string) => {
    if (currValue === username) return;
    const available = await isAvailable(currValue);

    if (available.error) return toast.error(available.message);
    if (available.response) return toast.error("Name not unavailable");

    const body = {
      userId: profileId,
      username: currValue,
    };
    const updateName = await updateUser(body);

    if (updateName.error) return toast.error(updateName.message);

    await update({ name: currValue });
    refresh();
  };

  return (
    <div
      style={{
        background: `linear-gradient(to bottom,${vibrantColor} 0% ,transparent 100%)`,
      }}
      className="w-full  flex flex-col gap-3 items-center"
    >
      <PreviousPage className="p-4" />
      <div className="self-center">
        <EditableImage
          updateSession={!isArtist}
          uploadUrl={isArtist ? "/api/artist" : `/api/user`}
          extraBody={{ userId: profileId }}
          fieldUpload={isArtist ? "cover" : "avatar"}
          initialValue={cover}
          isOwner={isOwner}
        />
      </div>

      <InputText
        min={3}
        max={25}
        rows={1}
        changeable={isOwner}
        initialValue={profileName}
        onblur={(currValue: string) => onchange(currValue)}
      />

      {follows > 0 && (
        <span className="font-montserrat text-gray-300">{follows} fans</span>
      )}

      {!isOwner && (
        <div className="flex flex-col gap-2 ">
          <Button
            onClick={() => (username ? fetchFollow() : push("/sign-in"))}
            className="bg-transparent py-1 text-base"
          >
            {isFollow ? "unfollow" : "Follow"}
          </Button>
        </div>
      )}
    </div>
  );
}
