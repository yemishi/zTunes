"use client";

import Link from "next/link";
import Image from "../ui/Image";
import Slider from "../Slider/Slider";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";
import { BundleType } from "@/types/response";

export default function BundleOrganizer({
  title,
  props,
  baseUrl,
}: {
  title: string;
  props: BundleType[];
  baseUrl: string;
}) {
  const [isMobileDev, setIsMobileDev] = useState<boolean>();

  useEffect(() => setIsMobileDev(isMobile), []);

  return (
    <div className="text-white p-4 flex flex-col font-kanit gap-3">
      <h2 className="text-xl first-letter:uppercase">{title}</h2>

      <Slider disableDrag={!isMobileDev}>
        {props.map((item, index) => {
          const { coverPhoto, id, title, artistId, artistName, isOfficial } =
            item;
          return (
            <div
              key={`${id}_${index}`}
              className={`${
                isMobileDev
                  ? "w-44 h-[216px]"
                  : "h-[300px] backdrop-brightness-125 flex-1 p-3 max-w-[240px] min-w-[150px]"
              }  flex flex-col gap-1 rounded-lg `}
            >
              <Link
                href={`${baseUrl}/${id}`}
                className="flex flex-col gap-2 relative"
              >
                <Image
                  src={coverPhoto}
                  className={`w-full  ${
                    isMobileDev ? "h-40  rounded-xl" : "h-52 rounded-lg"
                  }`}
                  alt="my"
                />
                <span className="font-poppins first-letter:uppercase truncate ml-1">
                  {title}
                </span>
              </Link>

              {isOfficial ? (
                <span className="font-light text-gray-400 first-letter:uppercase text-sm line-clamp-2 ml-1">
                  Official playlist
                </span>
              ) : (
                <Link
                  href={`/artist/${artistId}`}
                  className="font-light text-gray-400 first-letter:uppercase text-sm line-clamp-2 ml-1"
                >
                  {artistName}
                </Link>
              )}
            </div>
          );
        })}
      </Slider>
    </div>
  );
}
