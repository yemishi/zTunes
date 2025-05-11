import { SongsGridQuery } from "@/components";
import { Image } from "@/ui";

import { BundleType } from "@/types/response";
import Link from "next/link";
import { notFound } from "next/navigation";

async function fetchData(artistId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/album?artistId=${artistId}`, {
    cache: "no-store",
  });

  const albums = await res.json();

  if (albums.error) {
    if (albums.status === 404) return notFound();
    throw new Error(albums.message);
  }

  return albums as BundleType[];
}

export default async function Discography(props: { params: Promise<{ artistId: string }> }) {
  const params = await props.params;

  const { artistId } = params;

  const albums = await fetchData(artistId);

  return (
    <div className="flex flex-col pb-32 md:pb-20 md:ml-64 lg:ml-72 2xl:ml-80  min-[2000px]:ml-96">
      <Link
        href={`/artist/${artistId}`}
        className="p-4 first-letter:uppercase z-20 font-kanit text-lg sticky top-0 bg-[#121212] shadow-md shadow-black"
      >
        {albums[0].artistName}
      </Link>

      <div className="flex flex-col gap-5 ">
        {albums.map(({ title, type, releasedDate, coverPhoto, id, urlsSongs }, index) => {
          return (
            <div key={`${id}_${index}`} className="flex flex-col">
              <div className="w-full flex gap-2 p-4">
                <Image src={coverPhoto} className="size-32 rounded md:size-52" />
                <div className="flex flex-col gap-2 font-kanit">
                  <span className="text-2xl md:text-4xl">{title}</span>

                  <div className="flex gap-1 text-gray-300 font-light md:text-xl">
                    <span className="first-letter:uppercase">{type}</span>•<span>{releasedDate?.split("/")[2]}</span>•
                    <span>{urlsSongs?.length} songs</span>
                  </div>
                </div>
              </div>
              <SongsGridQuery asOl queryKey={["Songs", title]} url={`/api/song?albumId=${id}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
