import SongsOrganizer from "@/components/organizer/SongsOrganizer";
import Image from "@/components/ui/custom/Image";
import { BundleType } from "@/types/response";
import Link from "next/link";

async function fetchData(artistId: string) {
  const albums: BundleType[] = await fetch(
    `${process.env.URL}/api/album?artistId=${artistId}`
  ).then((res) => res.json());

  return albums;
}

export default async function Discography({
  params,
}: {
  params: { artistId: string };
}) {
  const albums = await fetchData(params.artistId);

  return (
    <div className="flex flex-col pb-32 md:pb-20 md:ml-64 lg:ml-72 2xl:ml-80  min-[2000px]:ml-96">
      <Link
        href={`/artist/${params.artistId}`}
        className="p-4 first-letter:uppercase z-20 font-kanit text-lg sticky top-0 bg-[#121212] shadow-md shadow-black"
      >
        {albums[0].artistName}
      </Link>

      <div className="flex flex-col gap-5 ">
        {albums.map(
          ({ title, type, releasedDate, coverPhoto, id, urlsSongs }, index) => {
            return (
              <div key={`${id}_${index}`} className="flex flex-col">
                <div className="w-full flex gap-2 p-4">
                  <Image src={coverPhoto} className="size-32 rounded" />
                  <div className="flex flex-col gap-2 font-kanit">
                    <span className="text-2xl">{title}</span>

                    <div className="flex gap-1 text-gray-300 font-light">
                      <span className="first-letter:uppercase">{type}</span>•
                      <span>{releasedDate?.split("/")[2]}</span>•
                      <span>{urlsSongs?.length} songs</span>
                    </div>
                  </div>
                </div>
                <SongsOrganizer
                  asOl
                  queryKey={["Songs", title]}
                  url={`/api/song?albumId=${id}`}
                />
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
