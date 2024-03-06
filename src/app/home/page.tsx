import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import ArtistsOrganizer from "../components/organizer/ArtistsOrganizer";
import BundleOrganizer from "../components/organizer/BundleOrganizer";

async function getData(username: string) {
  const albumProps = await fetch(`${process.env.URL}/api/album`).then((res) =>
    res.json()
  );
  const artistsProps = await fetch(
    `${process.env.URL}/api/artist?getAll=true`
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
    <div className="w-full min-h-full flex flex-col  pb-16">
      <BundleOrganizer
        title="popular albums"
        baseUrl="/album"
        props={albumProps}
      />

      {!recommendedProps.error && (
        <BundleOrganizer
          title="Recommended musics"
          baseUrl="/playlist"
          props={recommendedProps}
        />
      )}

      <ArtistsOrganizer title="artists" props={artistsProps} />
    </div>
  );
}
