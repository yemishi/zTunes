"use client";

import Link from "next/link";
import Image from "../ui/Image";
import Slider from "./Slider";
type PropsType = {
  title: string;
  id: string;
  coverPhoto: string;
  artistName: string;
  artistId: string;
};
export default function Carousel({
  title,
  props,
  baseUrl,
}: {
  title: string;
  props: PropsType[];
  baseUrl: string;
}) {
  return (
    <div className="text-white p-4 flex flex-col font-kanit gap-3">
      <h2 className="text-lg first-letter:uppercase">{title}</h2>
      <Slider>
        {props.map((item, index) => {
          const { coverPhoto, id, title, artistId, artistName } = item;
          return (
            <div key={`${id}_${index}`} className="w-44 flex flex-col gap-1">
              <Link href={`${baseUrl}/${id}`} className="flex flex-col gap-2">
                <Image
                  src={coverPhoto}
                  className="rounded-xl w-full h-40"
                  alt="my"
                />
                <span className="font-poppins first-letter:uppercase truncate ml-1">
                  {title}
                </span>
              </Link>

              <Link
                href={`/artist/${artistId}`}
                className="font-light text-gray-400 first-letter:uppercase text-sm truncate ml-1"
              >
                {artistName}
              </Link>
            </div>
          );
        })}
        
      </Slider>
      
    </div>
  );
}
