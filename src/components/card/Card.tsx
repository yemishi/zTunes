"use client";

import Link from "next/link";
import Image from "../ui/custom/Image";

export default function Card({
  artistName,
  coverPhoto,
  isOfficial,
  artistId,
  title,
  url,
  alt,
}: {
  alt?: string;
  url: string;
  title: string;
  coverPhoto: string;
  isOfficial: boolean;
  artistId?: string;
  artistName?: string;
}) {
  const subClass =
    "hidden md:block font-light text-gray-400 first-letter:uppercase text-sm line-clamp-2 ml-1";
  return (
    <div
      className="w-44 h-[200px] md:h-[288px] md:w-60 md:min-w-52 md:p-3 flex flex-col gap-1 rounded-lg md:hover:bg-black-450 md:bg-black-500
     md:active:bg-black-450"
    >
      <Link href={`${url}`} className="flex flex-col gap-2">
        <Image
          alt={alt}
          src={coverPhoto}
          className="w-full h-40 rounded-xl md:h-52 md:rounded-lg object-cover"
        />
        <span className="font-poppins first-letter:uppercase truncate ml-1">
          {title}
        </span>
      </Link>

      {isOfficial ? (
        <span className={subClass}>Official playlist</span>
      ) : (
        <Link href={`/artist/${artistId}`} className={subClass}>
          {artistName}
        </Link>
      )}
    </div>
  );
}
