import GenericHeader from "@/components/headers/GenericHeader";
import SongsQueryOrganizer from "@/components/organizer/SongsQueryOrganizer";
import { BundleType, ErrorType } from "@/types/response";
import { redirect } from "next/navigation";
async function fetchData(albumId: string) {
  try {
    const albumInfo: (BundleType & { urlsSongs: string[] }) | ErrorType =
      await fetch(`${process.env.URL}/api/album?albumId=${albumId}`, {
        cache: "no-store",
      }).then((res) => res.json());

    if (albumInfo.error) return redirect("404");
    return albumInfo;
  } catch (error) {
    return redirect("404");
  }
}

export default async function Album({
  params: { albumId },
}: {
  params: { albumId: string };
}) {
  const albumInfo = await fetchData(albumId);
  if (!albumInfo) return redirect("404");
  const {
    artistId,
    artistName,
    coverPhoto,
    releasedDate,
    title,
    avatar,
    desc,
    id,
    urlsSongs,
  } = albumInfo;

  return (
    <div className="flex flex-col pb-32 md:pb-20 md:ml-64 lg:ml-72 2xl:ml-80  min-[2000px]:ml-96">
      <GenericHeader
        info={{
          isOwner: false,
          authorId: artistId,
          author: artistName,
          avatar: avatar as string,
          coverPhoto,
          title,
          urlsSongs,
          desc,
          releasedDate,
        }}
      />
      <SongsQueryOrganizer
        asOl
        queryKey={["Songs", id]}
        url={`/api/song?albumId=${albumId}`}
      />
    </div>
  );
}
