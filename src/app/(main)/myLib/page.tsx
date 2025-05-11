import { authOptions } from "@/lib/auth";
import { ManyPlaylistType } from "@/types/response";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { Card } from "@/components";

async function fetchData(username: string) {
  const playlistsData = await fetch(`${process.env.URL}/api/playlist?username=${username}&authorName=${username}`).then(
    (res) => res.json()
  );
  if (playlistsData.error) {
    if (playlistsData.status === 404) return notFound();
    throw new Error(playlistsData.message);
  }
  return playlistsData as ManyPlaylistType;
}

export default async function MyLib() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return redirect("/login");
  const username = session.user.name;
  const { playlists } = await fetchData(username);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex flex-wrap w-full gap-4 justify-center">
        <Card
          coverPhoto="https://c4.wallpaperflare.com/wallpaper/617/416/921/heart-purple-plexus-wallpaper-preview.jpg"
          title="Liked songs"
          url="/myLib/likedSongs"
          isOfficial={false}
        />

        {playlists.map((item, index) => {
          const { coverPhoto, id, title, officialCategories } = item;

          return (
            <Card
              key={`${id}/${index}`}
              coverPhoto={coverPhoto}
              title={title}
              url={`/playlist/${id}`}
              isOfficial={!!officialCategories.length}
            />
          );
        })}
      </div>
    </div>
  );
}
