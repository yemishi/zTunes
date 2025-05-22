import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Card } from "@/components";
import purpleHeartImage from "./assets/purple_heart.jpg";
import UserPlaylistGrid from "./userPlaylistGrid/UserPlaylistGrid";

export default async function MyLib() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return redirect("/login");
  const username = session.user.name;

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex flex-wrap w-full gap-4 justify-center">
        <Card
          coverPhoto={purpleHeartImage as unknown as string}
          title="Liked songs"
          url="/myLib/likedSongs"
          isOfficial={false}
        />
        <UserPlaylistGrid username={username} />
      </div>
    </div>
  );
}
