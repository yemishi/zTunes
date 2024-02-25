"use client";
import { useEffect, useState } from "react";
import Image from "../ui/Image";
import Button from "../ui/Button";
import { useRouter } from "next/navigation";

type ArtistInfo = {
  artistId: string;
  artistName: string;
  cover: string;
};
export default function ArtistHeader({
  vibrantColor,
  username,
  artistInfo,
  followersLength,
  isInclude,
}: {
  username: string;
  isInclude: boolean;
  followersLength: number;
  vibrantColor: string;
  artistInfo: ArtistInfo;
}) {
  const { artistId, artistName, cover } = artistInfo;
  const [isFollow, setIsFollow] = useState<boolean>(isInclude);
  const [follows, setFollows] = useState<number>(followersLength);
  const { push } = useRouter();

  const fetchFollow = async () => {
    setIsFollow(!isFollow);

    const body = {
      username,
      artistId,
    };
    await fetch(`/api/followers`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });

    const data = await fetch(
      `/api/followers?artistId=${artistId}&username=`
    ).then((res) => res.json());
    setFollows(data.length);
  };

  return (
    <div
      style={{
        background: `linear-gradient(to bottom,${vibrantColor} 0% ,transparent 100%)`,
      }}
      className="w-full pt-20 p-2 flex flex-col gap-3 items-center"
    >
      <div className="self-center">
        <Image src={cover} className="size-[150px] rounded-full shadow-xl" />
      </div>

      <h1 className="text-[32px] font-kanit first-letter:uppercase font-medium">
        {artistName}
      </h1>
      <span className="font-montserrat text-gray-300">{follows} fans</span>
      <div className="flex flex-col gap-2 ">
        <Button
          onClick={() => (username ? fetchFollow() : push("/sign-in"))}
          className="bg-transparent py-1 text-base"
        >
          {isFollow ? "unfollow" : "Follow"}
        </Button>
      </div>
    </div>
  );
}
