"use client";

import Link from "next/link";
import Image from "../ui/Image";
import isMobile from "@/app/utils/isMobile";

export default function Card({
  artistName,
  coverPhoto,
  isOfficial,
  artistId,
  title,
  url,
}: {
  url: string;
  title: string;
  coverPhoto: string;
  isOfficial: boolean;
  artistId?: string;
  artistName?: string;
}) {
  const checkIsMobile = isMobile();
  return (
    <div
      className={`${
        checkIsMobile
          ? "w-44 h-[200px]"
          : `h-[${
              artistName || isOfficial ? 300 : 280
            }px] bg-black-500 flex-1 p-3 max-w-[240px] min-w-[150px] md:min-w-[210px]`
      }  flex flex-col gap-1 rounded-lg md:hover:bg-black-450 md:active:bg-black-450`}
    >
      <Link href={`${url}`} className="flex flex-col gap-2">
        <Image
          src={coverPhoto}
          className={`w-full  ${
            checkIsMobile ? "h-40  rounded-xl" : "h-52 rounded-lg"
          }`}
        />
        <span className="font-poppins first-letter:uppercase truncate ml-1">
          {title}
        </span>
      </Link>

      {isOfficial
        ? !checkIsMobile && (
            <span className="font-light text-gray-400 first-letter:uppercase text-sm line-clamp-2 ml-1">
              Official playlist
            </span>
          )
        : !checkIsMobile && (
            <Link
              href={`/artist/${artistId}`}
              className="font-light text-gray-400 first-letter:uppercase text-sm line-clamp-2 ml-1"
            >
              {artistName}
            </Link>
          )}
    </div>
  );
}
