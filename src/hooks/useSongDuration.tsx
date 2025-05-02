"use client";

import { getSongDuration } from "@/utils/helpers";
import { formatDuration } from "@/utils/formatting";
import { useEffect, useState } from "react";

export default function useSongDuration(urlSong: string) {
  const [duration, setDuration] = useState<string>("0s");

  useEffect(() => {
    const seconds = getSongDuration(urlSong);
    seconds.then((res) => {
      const formatted = formatDuration(res as number);
      setDuration(formatted);
    });
  }, [urlSong]);
  return duration;
}
