"use client";

import { SongType } from "@/types/response";

import { RiAlbumLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { MdPlaylistAdd } from "react-icons/md";
import { CgPlayListRemove } from "react-icons/cg";
import { toast } from "react-toastify";
import { removeFromPlaylist } from "@/utils/helpers";

import Image from "../ui/custom/Image";
import Link from "next/link";
import Button from "../ui/buttons/Button";
import ToggleLike from "../ui/buttons/ToggleLike";
import { useSession } from "next-auth/react";
import AddToPlaylist from "./addToPlaylist";
import { useTempOverlay } from "@/context/Provider";

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {
  song: SongType;
  onclose: () => void;
  playlistId?: string;
  refetch?: () => void;
}

export default function SongOptions({
  song,
  onclose,
  playlistId,
  refetch,
  className,
  ...props
}: DivProps) {
  const { push } = useRouter();
  const { albumId, artistId, artistName, coverPhoto, name, id, createdAt } =
    song;
  const { data: session } = useSession();
  const user = session?.user;

  const selected = { songId: id, createdAt };
  const toRemove = () => {
    removeFromPlaylist(selected, playlistId as string).then((res) => {
      if (res.error) return toast.error(res.message);
      toast.success(res.message);
      onclose();
      return refetch ? refetch() : null;
    });
  };
  const options = {
    songSelected: {
      songId: id,
      createdAt,
    },
    coverPhoto,
    title: name,
  };

  const { close, setChildren } = useTempOverlay();
  const PlaylistsOptions = () => (
    <AddToPlaylist
      onclose={close}
      options={options}
      userAvatar={user?.picture}
      username={user?.name}
    />
  );

  const linkStyle =
    "flex gap-3 py-2 md:w-60 md:rounded-lg md:bg-gradient-to-r md:from-transparent hover:to-black-500 items-center text-left";
  return (
    <div
      {...props}
      className="flex bg-black fixed top-2/4 -translate-y-2/4  bg-opacity-75 md:bg-black-400 md:bg-opacity-75 flex-col md:text-center font-medium text-lg md:text-xl h-full w-full font-kanit 
      md:max-w-[550px] md:max-h-[700px] md:items-center md:pt-4 md:rounded-lg backdrop-blur-lg  p-4 pt-20"
    >
      <div className="flex md:flex-col md:items-center gap-5 mb-7">
        <Image src={coverPhoto} className="size-16 md:size-44" />
        <span className="flex flex-col">
          <span className="text-lg first-letter:uppercase md:text-2xl">
            {name}
          </span>
          <span className="text-white text-opacity-75 text-sm md:text-lg">
            {artistName}
          </span>
        </span>
      </div>

      <div className={linkStyle}>
        <ToggleLike
          onClick={() => (user ? null : onclose())}
          className="size-6 md:size-10 p-0"
          songId={id}
        />
        Like
      </div>

      <Link
        href={`/artist/${artistId}`}
        onClick={onclose}
        className="flex gap-3 py-2 md:w-60 md:rounded-lg md:bg-gradient-to-r md:from-transparent hover:to-black-500   items-center"
      >
        <BsFillPersonPlusFill className="size-6 md:size-10" />
        See artist
      </Link>

      <Link href={`/album/${albumId}`} onClick={onclose} className={linkStyle}>
        <RiAlbumLine className="size-6 md:size-10" />
        See album
      </Link>

      <button
        onClick={() => {
          if (!user) return push("/sign-in"), onclose();
          setChildren(PlaylistsOptions);
        }}
        className={linkStyle}
      >
        <MdPlaylistAdd className="size-6 md:size-10 duration-200" />
        Add to a playlist
      </button>

      {playlistId && (
        <button onClick={toRemove} className={linkStyle}>
          <CgPlayListRemove className="size-6 md:size-10 duration-200" />
          Remove from playlist
        </button>
      )}

      <Button onClick={onclose} className="mt-auto mb-14 self-center md:mt-12">
        Close
      </Button>
    </div>
  );
}
