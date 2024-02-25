"use client";
import Link from "next/link";
import Slider from "../Slider/Slider";
import Image from "../ui/Image";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";

type PropsType = {
  cover: string;
  id: string;
  name: string;
};

export default function ArtistsOrganizer({
  props,
  title,
}: {
  props: PropsType[];
  title: string;
}) {
  const [isMobileDev, setIsMobileDev] = useState<boolean>();
  useEffect(() => setIsMobileDev(isMobile), []);

  return (
    <div className="text-white p-4 flex flex-col font-kanit gap-3">
      <h2 className="text-xl first-letter:uppercase">{title}</h2>
      <Slider
        disableDrag={!isMobileDev}
  
      >
        {props.map((item, index) => {
          const { id, name, cover } = item;

          return (
            <Link
              href={`/artist/${id}`}
              key={`${id}-${index}`}
              className={`items-center px-4 py-2 justify-between ${
                isMobileDev
                  ? "w-44 h-52"
                  : "h-64  backdrop-brightness-125 flex-1 py-5 max-w-64 min-w-[150px]"
              }  flex flex-col rounded-lg "
              }`}
            >
              <Image
                src={cover}
                className={`${
                  isMobileDev ? "h-36 w-36" : "w-44 h-44"
                } rounded-full shadow-lg shadow-gray-950 object-`}
              />
              <span className="font-poppins first-letter:uppercase  line-clamp-1">
                {name}
              </span>
            </Link>
          );
        })}
      </Slider>
    </div>
  );
}
