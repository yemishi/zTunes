"use client";

import { useState } from "react";

export default function ArtistAbout({
  about,
}: {
  about: {
    summary: string;
    cover: string;
  };
}) {
  const [clamp, setClamp] = useState<boolean>(true);

  const { cover, summary } = about;
  return (
    <div className="w-full flex flex-col gap-2  p-4">
      <h2 className="text-xl font-kanit">About</h2>
      <div className={clamp ? "" : "flex flex-col"}>
        <span
          onClick={() => setClamp(!clamp)}
          className={`${clamp ? "line-clamp-3" : ""} font-light text-gray-300`}
        >
          {summary}
        </span>
        <span
          onClick={() => setClamp(!clamp)}
          className="font-semibold font-kanit"
        >
          {clamp ? "see more" : "see less"}
        </span>
      </div>
    </div>
  );
}
