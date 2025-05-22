"use server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { ErrorWrapper, ProfileGrid, BundleGrid } from "@/components";

const getPlaylists = async (username: string): Promise<any> => {
  const playlists = await fetch(`${process.env.URL}/api/playlist/recommended?username=${username}`, {
    next: { revalidate: 7200, tags: ["recommendedPlaylists", username || "anonymous"] },
  }).then((res) => res.json());
  return playlists;
};

const getAlbums = async () =>
  await fetch(`${process.env.URL}/api/album?take=10`, { next: { revalidate: 7200, tags: ["highlightAlbums"] } }).then(
    (res) => res.json()
  );
const getArtists = async () =>
  await fetch(`${process.env.URL}/api/artist?take=10`, { next: { revalidate: 7200, tags: ["highlightArtists"] } }).then(
    (res) => res.json()
  );

export default async function Home() {
  const session = await getServerSession(authOptions);
  const [albums, artists, playlists] = await Promise.all([
    getAlbums(),
    getArtists(),
    getPlaylists(session?.user?.name as string),
  ]);
  return (
    <div className="w-full h-full flex flex-col">
      <ErrorWrapper error={albums.error} message={albums.message} className="ml-4 mt-4 self-center md:self-start">
        {albums?.length > 0 && <BundleGrid title="popular albums" baseUrl="/album" props={albums} />}
      </ErrorWrapper>

      <ErrorWrapper error={playlists.error} message={playlists.message} className="ml-4 mt-4 self-center md:self-start">
        {playlists && playlists?.length > 0 && (
          <BundleGrid title="You May like" baseUrl="/playlist" props={playlists} />
        )}
      </ErrorWrapper>

      <ErrorWrapper error={artists.error} message={artists.message} className="ml-4 mt-4 self-center md:self-start">
        {artists.length > 0 && <ProfileGrid title="artists" props={artists} />}
      </ErrorWrapper>
    </div>
  );
}
