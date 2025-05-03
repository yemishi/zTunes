import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import ArtistsOrganizer from "../../components/organizer/ProfileOrganizer";
import BundleOrganizer from "../../components/organizer/BundleOrganizer";
import ErrorWrapper from "@/components/ErrorWrapper";

const getPlaylists = (username: string): any => async () => {
  if (!username) return
  const playlists = await fetch(
    `${process.env.URL}/api/playlist/recommended?username=${username}`
  ).then((res) => res.json())
  return playlists
}

const getAlbums = async () => await fetch(
  `${process.env.URL}/api/album?take=10`
).then((res) => res.json());

const getArtists = async () => await fetch(
  `${process.env.URL}/api/artist?take=10`
).then((res) => res.json());

export default async function Home() {
  const session = await getServerSession(authOptions);
  const [albums, artists, playlists] = await Promise.all([getAlbums(), getArtists(), getPlaylists(session?.user?.name as string)])

  return (
    <div className="w-full min-h-full flex flex-col pb-32 md:pb-20 md:ml-64 lg:ml-72 2xl:ml-80 min-[2000px]:ml-96">
      <ErrorWrapper error={albums.error} message={albums.message} className="ml-4 mt-4 self-center md:self-start" >
        {albums.length > 0 && (
          <BundleOrganizer
            title="popular albums"
            baseUrl="/album"
            props={albums}
          />
        )}
      </ErrorWrapper>

      <ErrorWrapper error={playlists.error} message={playlists.message} className="ml-4 mt-4 self-center md:self-start">
        {playlists && playlists.length > 0 && (
          <BundleOrganizer
            title="You will like"
            baseUrl="/playlist"
            props={playlists}
          />
        )}
      </ErrorWrapper>

      <ErrorWrapper error={artists.error} message={artists.message} className="ml-4 mt-4 self-center md:self-start">
        {artists.length > 0 && (
          <ArtistsOrganizer title="artists" props={artists} />
        )}
      </ErrorWrapper>
    </div>
  );
}
