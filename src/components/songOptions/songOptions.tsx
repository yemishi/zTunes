"use client";

import { SongType } from "@/types/response";

import { RiAlbumLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { MdPlaylistAdd } from "react-icons/md";
import { CgPlayListRemove } from "react-icons/cg";
import { toast } from "react-toastify";
import { cleanClasses, removeFromPlaylist } from "@/utils/helpers";
import { GoPerson } from "react-icons/go";

import Link from "next/link";
import { HTMLAttributes, useEffect, useRef, useState } from "react";
import { RxDotsVertical } from "react-icons/rx";
import useLike from "@/hooks/useLike";
import { AiOutlineLogin } from "react-icons/ai";
import { LuHeart, LuHeartCrack } from "react-icons/lu";
import AddToPlaylist from "./addSongToPlaylist/addToPlaylist";

interface DivProps extends HTMLAttributes<HTMLDivElement> {
  song: SongType;
  playlistId?: string;
  refetch?: () => void;
  username?: string;
  vibrantColor?: { color: string; isLight: boolean };
  iconClassName?: string;
  isOwner?: boolean;
}

export default function SongOptions({
  song,
  playlistId,
  refetch,
  username,
  vibrantColor,
  isOwner,
  iconClassName = "",
  ...props
}: DivProps) {
  const { className = "", ...rest } = props;
  const { album, artistId, id, createdAt } = song;
  const { isLiked, isLoading, toggleLike } = useLike(id, username);
  const [isOptions, setIsOptions] = useState(false);
  const [isAddPlaylist, setIsAddPlaylist] = useState(false);
  const selected = { songId: id, createdAt };
  const optionsRef = useRef<HTMLDivElement | null>(null);

  const closeOptions = () => {
    setIsOptions(false), setIsAddPlaylist(false);
  };
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as HTMLElement;

      if (target.closest("#modal")) return;
      if (isOptions && optionsRef.current && !optionsRef.current.contains(target)) {
        closeOptions();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOptions]);

  const toRemove = () => {
    removeFromPlaylist(selected, playlistId as string).then((res) => {
      if (res.error) return toast.error(res.message);
      toast.success(res.message);
      closeOptions();
      return refetch ? refetch() : null;
    });
  };

  const login = {
    Login: {
      href: "/login",
      isLoading: false,
      onClick: () => closeOptions(),
      Icon: AiOutlineLogin,
    },
  };
  const likeTitle = isLiked ? "Unlike" : "Like";
  const like = {
    [likeTitle]: {
      href: "",
      isLoading,
      Icon: isLiked ? LuHeartCrack : LuHeart,
      onClick: () => {
        toggleLike(), closeOptions();
        if (refetch) refetch();
      },
    },
  };
  const ownerOption = isOwner
    ? {
        Remove: {
          href: "",
          Icon: CgPlayListRemove,
          isLoading: false,
          onClick: () => {
            toRemove(), closeOptions();
            if (refetch) refetch();
          },
        },
      }
    : {};

  const firstItem = username ? like : login;
  const lis = {
    "See Artist": {
      href: `/artist/${artistId}`,
      Icon: GoPerson,
      isLoading: false,
      onClick: () => closeOptions(),
    },
    "See Album": {
      href: `/album/${album.id}`,
      Icon: RiAlbumLine,
      isLoading: false,
      onClick: () => closeOptions(),
    },
  };

  const addToPlaylist = username
    ? {
        "Add to a playlist": {
          isLoading: false,
          href: "",
          onClick: () => setIsAddPlaylist(true),
          Icon: MdPlaylistAdd,
        },
      }
    : {};

  return (
    <div ref={optionsRef} className="relative">
      <RxDotsVertical
        onClick={() => setIsOptions(!isOptions)}
        className={cleanClasses(iconClassName, "h-10 w-6 cursor-pointer")}
      />

      {isOptions && (
        <div
          {...props}
          style={{ background: vibrantColor ? vibrantColor.color : "#2f2f2f " }}
          className={`${className} absolute ${className.includes("right-") ? "" : "right-2"} z-10 `}
        >
          <ul className={`flex flex-col gap-2 md:text-lg p-2 rounded-md relative w-52 shadow-md shadow-black`}>
            {Object.entries({ ...firstItem, ...lis, ...ownerOption, ...addToPlaylist }).map(
              ([desc, { Icon, isLoading, onClick, href }], i) => {
                const className = `${isLoading ? "animate-pulse pointer-events-none" : ""} flex gap-2 items-center p-2 hover:backdrop-brightness-150
             rounded-md active:backdrop-brightness-50 w-full cursor-pointer`;

                return (
                  <li key={`${desc}_${i}`} className="flex">
                    {href ? (
                      <Link href={href} className={className}>
                        <Icon className="size-6" />
                        <span>{desc}</span>
                      </Link>
                    ) : (
                      <button onClick={onClick!} className={className}>
                        <Icon className="size-6" />
                        <span>{desc}</span>
                      </button>
                    )}
                  </li>
                );
              }
            )}
            {isAddPlaylist && (
              <AddToPlaylist
                onClose={closeOptions}
                vibrantColor={vibrantColor}
                username={username!}
                songId={id}
                refresh={refetch}
              />
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
