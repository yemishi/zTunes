import { authOptions } from "@/lib/auth";
import { ErrorType, ManyPlaylistType } from "@/types/response";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Card from "../../components/card/Card";

async function fetchData(username: string) {
  const playlistsData: ManyPlaylistType | ErrorType = await fetch(
    `${process.env.URL}/api/playlist?username=${username}&authorName=${username}`
  ).then((res) => res.json());
  if (playlistsData.error) return redirect("404");
  return {
    playlistsData,
  };
}

export default async function MyLib() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return redirect("/sign-in");
  const username = session.user.name;
  const {
    playlistsData: { playlists },
  } = await fetchData(username);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex flex-wrap w-full gap-4 justify-center ">
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
