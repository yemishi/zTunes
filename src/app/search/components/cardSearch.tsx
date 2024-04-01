"use client";

import Image from "@/components/ui/custom/Image";
import Link from "next/link";
import { SearchType } from "../page";
import { useRouter } from "next/navigation";
import { useState } from "react";

type UrlValues = "album" | "artist" | "user" | "playlist";

export default function CardSearch({
  data,
  username,
  isHistoric,
  isLoading: loadingProp,
}: {
  isLoading?: boolean;
  username: string;
  data: SearchType;
  isHistoric?: true;
}) {
  const { refId, type, title, coverPhoto, desc: descData } = data;
  const desc = descData || type;

  const baseUrl = {
    album: "/album",
    artist: "/artist",
    user: "/user",
    playlist: "/playlist",
  };
  const url = baseUrl[type.toLowerCase() as UrlValues]
    ? `${baseUrl[type.toLowerCase() as UrlValues]}/${refId}`
    : "/serach";

  const { refresh } = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleHistoric = async (action?: string) => {
    if (!username) return;
    setIsLoading(true);
    await fetch(`/api/search`, {
      method: "PATCH",
      body: JSON.stringify({
        ...data,
        username,
        action,
      }),
    });
    setIsLoading(false);
  };

  const removeFromHistory = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!username) return;
    setIsLoading(true);
    await handleHistoric("remove");
    return refresh(), setIsLoading(false);
  };
  const loadingClass =
    isLoading || loadingProp
      ? "grayscale animate-pulse pointer-events-none"
      : "";
  return (
    <Link
      onClick={() => handleHistoric()}
      href={url}
      className={`w-full flex gap-3 p-2 py-1 duration-150  hover:bg-black-500 active:bg-black items-center  ${loadingClass}`}
    >
      <span className="size-12 md:size-16">
        <Image
          src={coverPhoto}
          className={`h-full w-full ${
            desc.toLowerCase() === "user" || desc.toLowerCase() === "artist"
              ? "rounded-full"
              : "rounded-lg"
          }`}
        />
      </span>

      <div className="flex flex-col font-kanit font-light leading-3 md:font-medium">
        <span className="text-lg first-letter:uppercase md:text-xl">{title}</span>
        <span className="text-white text-opacity-65 text-sm md:text-base">{desc}</span>
      </div>
      {isHistoric && (
        <button
          onClick={removeFromHistory}
          className="ml-auto self-center font-kanit text-xl md:text-2xl"
        >
          X
        </button>
      )}
    </Link>
  );
}
