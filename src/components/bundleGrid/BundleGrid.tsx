"use client";

import Slider from "../slider/Slider";
import { BundleType } from "@/types/response";
import Card from "../card/Card";
import Link from "next/link";

export default function BundleGrid({
  title,
  props,
  seeMore,
  baseUrl,
}: {
  title: string;
  props: BundleType[];
  baseUrl: string;
  seeMore?: string;
}) {
  return (
    <div className="text-white p-4 flex flex-col font-kanit gap-3">
      <span className="flex items-center">
        <h2 className="text-xl first-letter:uppercase lg:text-2xl">{title}</h2>

        {seeMore && (
          <Link href={seeMore} className="ml-auto text-white text-opacity-65 hover:text-opacity-100">
            See more
          </Link>
        )}
      </span>

      <Slider>
        {props.map((item, index) => {
          const { coverPhoto, id, title, artistId, artistName, isOfficial } = item;
          return (
            <Card
              key={`${id}_${index}`}
              artistId={artistId}
              artistName={artistName}
              coverPhoto={coverPhoto}
              isOfficial={!!isOfficial}
              title={title}
              url={`${baseUrl}/${id}`}
            />
          );
        })}
      </Slider>
    </div>
  );
}
