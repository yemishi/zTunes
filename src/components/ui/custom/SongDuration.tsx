import useSongDuration from "@/hooks/useSongDuration";
import { useCallback } from "react";

export default function SongDuration({
  urlSong,
  rerender,
}: {
  urlSong: string;
  rerender: any;
}) {
  const Duration = useCallback(() => {
    const duration = useSongDuration(urlSong);
    return <span className="text-lg opacity-75">{duration}</span>;
  }, [rerender]);
  return <Duration />;
}
