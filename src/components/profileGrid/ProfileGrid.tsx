"use client";

import Link from "next/link";
import Slider from "../slider/Slider";
import ProfileCard from "../card/ProfileCard";

type PropsType = {
  cover: string;
  id: string;
  name: string;
  isArtist: boolean;
};

export default function ProfileGrid({
  props,
  title,
  seeMore,
}: {
  props: PropsType[];
  title: string;
  seeMore?: string;
}) {
  return (
    <div className="text-white p-4 flex flex-col font-kanit gap-3">
      <span className="flex items-center">
        <h2 className="text-xl first-letter:uppercase">{title}</h2>
        {seeMore && (
          <Link href={seeMore} className="ml-auto text-white text-opacity-65 hover:text-opacity-100">
            See more
          </Link>
        )}
      </span>
      <Slider>
        {props.map((item, index) => {
          return <ProfileCard key={`${item.id}_${index}`} props={item} />;
        })}
      </Slider>
    </div>
  );
}
