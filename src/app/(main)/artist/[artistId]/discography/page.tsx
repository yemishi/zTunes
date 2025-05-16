import { SongsGridQuery } from "@/components";
import { Image, PreviousPage } from "@/ui";

import { BundleType } from "@/types/response";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function fetchData(artistId: string) {
  const res = await fetch(`${process.env.URL}/api/album?artistId=${artistId}`);

  const albums = await res.json();

  if (albums.error) {
    throw new Error(albums.message);
  }

  return albums as BundleType[];
}

export default async function Discography(props: { params: Promise<{ artistId: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  const username = session?.user?.name;
  const { artistId } = params;

  const albums = await fetchData(artistId);
  return (
    <div className="flex flex-col">
      <div className="flex w-full top-0 z-20 bg-black-500">
        <span className="flex gap-4 items-center">
          <PreviousPage className="" />
          <h1 className="text-xl md:text-2xl font-montserrat font-semibold"> {albums[0].artistName}</h1>
        </span>
      </div>
      <div className="flex flex-col gap-5">
        {albums.map(({ title, type, releasedDate, coverPhoto, id, tracks, vibrantColor }, index) => {
          return (
            <div key={`${id}_${index}`} className="flex flex-col">
              <div
                style={
                  vibrantColor
                    ? {
                        background: `linear-gradient(to bottom,${vibrantColor.color} 10%,transparent 100%)`,
                        boxShadow: `0px -10px 90px -50px ${vibrantColor.color}`,
                      }
                    : {}
                }
                className={`w-full flex gap-2 p-4 z-0 ${vibrantColor?.isLight ? "text-black" : "text-white"}`}
              >
                <Image src={coverPhoto} className="size-32 rounded md:size-52" />
                <div className="flex flex-col gap-2 font-kanit">
                  <span className="text-2xl md:text-4xl">{title}</span>
                  <div className="flex gap-1 font-light md:text-xl">
                    <span className="first-letter:uppercase">{type}</span>•<span>{releasedDate?.split("/")[2]}</span>•
                    <span>{tracks?.length} songs</span>
                  </div>
                </div>
              </div>
              <SongsGridQuery
                isScrollQuery={false}
                username={username}
                asOl
                queryKey={["Songs", title]}
                url={`/api/song?albumId=${id}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
