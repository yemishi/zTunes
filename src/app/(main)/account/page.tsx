import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

import { ProfileHeader } from "@/components";
import AlbumsGrid from "./albumsGrid/AlbumsGrid";
import DeleteAcc from "./deleteAcc/DeleteAcc";
import UpgradeToArtist from "./upgradeToArtist/UpgradeToArtist";
import Logout from "@/ui/buttons/Logout";
import UpgradeToAdmin from "./upgradeToAdmin/UpgradeToAdmin";
import { ErrorWrapper } from "@/components";

async function fetchData(username: string) {
  const data = await fetch(`${process.env.URL}/api/user?username=${username}&artistToo=true`, {
    next: { revalidate: 7200, tags: ["userInfo", username] },
  }).then((res) => res.json());
  if (data.error) {
    if (data.status === 404) return notFound();
    throw new Error(data.message);
  }
  const albumsData = await fetchAlbums(data.isArtist ? data.id : null);

  return [data, albumsData];
}
async function fetchAlbums(artistId: string | null) {
  if (!artistId) return;
  const albums = await fetch(`${process.env.URL}/api/album?artistId=${artistId}`, { cache: "no-store" }).then((res) =>
    res.json()
  );
  return albums;
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");

  const { name: username } = session.user;
  const [{ avatar, id, name, isArtist, isAdmin, vibrantColor }, albums] = await fetchData(username);

  return (
    <div className="flex flex-col gap-4 relative">
      <ProfileHeader
        dataTags={["userInfo", username]}
        followersLength={0}
        disableFollow
        profileInfo={{ cover: avatar, profileId: id, profileName: name, vibrantColor }}
        username={name}
      />

      <div className="flex flex-col max-w-7xl">
        {!isArtist && !isAdmin && (
          <>
            <UpgradeToAdmin userId={id} />
            <UpgradeToArtist userId={id} />
          </>
        )}

        {albums && (
          <ErrorWrapper error={albums.error} message={albums.message}>
            <AlbumsGrid artistId={id} props={albums} />
          </ErrorWrapper>
        )}

        <Logout className="ml-auto rounded-lg mr-5" />
      </div>
      <DeleteAcc isLightBg={vibrantColor.isLight} userId={id} />
    </div>
  );
}
