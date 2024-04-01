import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import ArtistsOrganizer from "../../components/organizer/ProfileOrganizer";
import BundleOrganizer from "../../components/organizer/BundleOrganizer";
import { BundleType } from "@/types/response";

async function getData(username: string) {
  const albumProps: BundleType[] = await fetch(
    `${process.env.URL}/api/album?take=10`
  ).then((res) => res.json());
  const artistsProps = await fetch(
    `${process.env.URL}/api/artist?take=10`
  ).then((res) => res.json());

  const recommendedProps = await fetch(
    `${process.env.URL}/api/playlist/recommended?username=${username}`
  ).then((res) => res.json());
  return {
    albumProps,
    artistsProps,
    recommendedProps,
  };
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const data = await getData(session?.user.name as string);
  const { albumProps, artistsProps, recommendedProps } = data;

  return (
    <div className="w-full min-h-full flex flex-col pb-32 md:pb-20 md:ml-64 lg:ml-72 2xl:ml-80 min-[2000px]:ml-96">
      {albumProps.length > 0 && (
        <BundleOrganizer
          title="popular albums"
          baseUrl="/album"
          props={albumProps}
        />
      )}

      {!recommendedProps.error && (
        <BundleOrganizer
          title="You will like"
          baseUrl="/playlist"
          props={recommendedProps}
        />
      )}

      {artistsProps.length > 0 && (
        <ArtistsOrganizer title="artists" props={artistsProps} />
      )}
    </div>
  );
}
