import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

import ProfileHeader from "../../components/headers/ProfileHeader";
import Albums from "./components/Albums";
import DeleteAcc from "./components/userManager/DeleteAcc";
import UpgradeToArtist from "./components/userManager/UpgradeToArtist";
import Logout from "../../components/ui/buttons/Logout";
import UpgradeToAdmin from "./components/userManager/UpgradeToAdmin";
import ErrorWrapper from "@/components/ErrorWrapper";

async function fetchData(username: string) {
  const data = await fetch(
    `${process.env.URL}/api/user?username=${username}&artistToo=true`,
    { cache: "no-store" }
  ).then((res) => res.json());
  if (data.error) {
    if (data.status === 404) return notFound()
    throw new Error(data.message);
  }
  const albumsData = await fetchAlbums(data.isArtist ? data.id : null)

  return [data, albumsData];
}
async function fetchAlbums(artistId: string | null) {
  if (!artistId) return;
  const albums = await fetch(
    `${process.env.URL}/api/album?artistId=${artistId}`,
    { cache: "no-store" }
  ).then((res) => res.json());
  return albums;
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/sign-in");

  const { name: username } = session.user;
  const [{ avatar, id, name, isArtist, isAdmin }, albums] = await fetchData(username);

  return (
    <div className="flex flex-col gap-4 relative pb-32 md:pb-20 md:ml-64 lg:ml-72 2xl:ml-80 min-[2000px]:ml-96">
      <ProfileHeader
        followersLength={0}
        profileInfo={{ cover: avatar, profileId: id, profileName: name }}
        username={name}
      />

      <div className="flex flex-col max-w-7xl">
        {!isArtist && !isAdmin && (
          <>
            <UpgradeToAdmin userId={id} />
            <UpgradeToArtist userId={id} />
          </>
        )}

        {albums && <ErrorWrapper error={albums.error} message={albums.message}>
          <Albums artistId={id} props={albums} />
        </ErrorWrapper>}

        <Logout className="ml-auto rounded-lg mr-5" />
      </div>
      <DeleteAcc userId={id} />
    </div>
  );
}
