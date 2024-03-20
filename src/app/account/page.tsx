import { BundleType, ErrorType, UserType } from "@/types/response";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { GrUserAdmin } from "react-icons/gr";
import { CardAcc } from "./components/CardAcc";
import { authOptions } from "@/lib/auth";
import { getVibrantColor } from "../utils/fnc";

import ProfileHeader from "../components/headers/ProfileHeader";
import Albums from "./components/Albums";
import DeleteAcc from "./components/userManager/DeleteAcc";
import UpgradeToArtist from "./components/userManager/UpgradeToArtist";
import Logout from "../components/ui/buttons/Logout";

async function fetchData(username: string) {
  const data: UserType | ErrorType = await fetch(
    `${process.env.URL}/api/user?username=${username}&artistToo=true`,
    { cache: "no-store" }
  ).then((res) => res.json());
  if (data.error) return redirect("404");
  return data;
}

async function fetchAlbums(artistId: string | null) {
  if (!artistId) return null;
  const albums: BundleType[] = await fetch(
    `${process.env.URL}/api/album?artistId=${artistId}`,
    { cache: "no-store" }
  ).then((res) => res.json());
  return albums;
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/sign-in");

  const { isAdmin, name: username } = session.user;
  const { avatar, id, name, isArtist } = await fetchData(username);

  const albums = await fetchAlbums(isArtist ? id : null);
  const vibrantColor = await getVibrantColor(avatar);

  return (
    <div className="text-white flex flex-col gap-4 relative">
      <ProfileHeader
        followersLength={0}
        profileInfo={{ cover: avatar, profileId: id, profileName: name }}
        username={name}
        vibrantColor={vibrantColor?.default as string}
      />

      {!isArtist && !isAdmin && (
        <div>
          <CardAcc
            Icon={GrUserAdmin}
            title="Join us"
            subTitle="Upgrade to admin account"
          />
          <UpgradeToArtist userId={id} />
        </div>
      )}

      {albums && <Albums artistId={id} props={albums} />}

      <Logout className="ml-auto rounded-lg mr-5" />
      <DeleteAcc userId={id} />
    </div>
  );
}
