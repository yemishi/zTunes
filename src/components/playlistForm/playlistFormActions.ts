import { ErrorType } from "@/types/response";

type FetchPayload = {
  title: string;
  isPublic: boolean;
  coverPhoto: string;
  username: string;
  desc?: string;
  officialCategories?: string[] | null;
};

const updatePlaylist  = async (playlist: FetchPayload, id: string) => {
  const fetchData: ErrorType = await fetch("/api/playlist", {
    method: "PATCH",
    body: JSON.stringify({ ...playlist, id }),
  }).then((res) => res.json());
  return fetchData;
};
const createPlaylist = async (playlist: FetchPayload) => {
  const uploadPlaylist: ErrorType = await fetch("/api/playlist", {
    method: "POST",
    body: JSON.stringify(playlist),
  }).then((res) => res.json());
  return uploadPlaylist;
};

export { updatePlaylist, createPlaylist };
