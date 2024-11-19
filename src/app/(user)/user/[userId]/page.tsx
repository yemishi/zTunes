import ProfileHeader from "@/components/headers/ProfileHeader";
import BundleOrganizer from "@/components/organizer/BundleOrganizer";
import ProfileOrganizer from "@/components/organizer/ProfileOrganizer";
import { authOptions } from "@/lib/auth";
import { BundleType, FollowersType, UserType } from "@/types/response";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import getVibrantColor from "@/utils/getVibrantColor";

async function fetchData(userId: string, username: string) {
  try {
    const followersInfo: FollowersType = await fetch(
      `${process.env.URL}/api/followers?username=${username}&artistId=${userId}`
    ).then((res) => res.json());

    const userData: UserDataType = await fetch(
      `${process.env.URL}/api/user?userId=${userId}&getFollows=true`
    ).then((res) => res.json());

    const { followsInfo, userInfo, hasMore: hasMoreFollows } = userData;

    const playlistData: { playlists: BundleType[]; hasMore: boolean } =
      await fetch(
        `${process.env.URL}/api/playlist?username=${username}&authorName=${userInfo.name}&limit=5`
      ).then((res) => res.json());

    return {
      followersInfo,
      userInfo,
      playlistData,
      followsInfo,
      hasMoreFollows,
    };
  } catch (error) {
    redirect("404");
  }
}

export default async function UserPage({
  params: { userId },
}: {
  params: { userId: string };
}) {
  const session = await getServerSession(authOptions);
  const username = session?.user.name as string;

  const { followersInfo, userInfo, followsInfo, playlistData, hasMoreFollows } =
    await fetchData(userId, username);

  const { hasMore, playlists } = playlistData;

  const vibrantColor = await getVibrantColor(userInfo.avatar).then(
    (res) => res?.default
  );

  const profileInfo = {
    profileName: userInfo.name,
    profileId: userInfo.id,
    cover: userInfo.avatar,
  };
  return (
    <div className="flex flex-col gap-4 pb-32 md:ml-64 lg:ml-72 2xl:ml-80 min-[2000px]:ml-96">
      <ProfileHeader
        username={username}
        profileInfo={profileInfo}
        followersLength={followersInfo.length}
        isInclude={followersInfo.isInclude}
        vibrantColor={vibrantColor || "transparent"}
      />
      {playlists.length > 0 && (
        <BundleOrganizer
          seeMore={hasMore ? `/user/${userId}/playlists` : undefined}
          baseUrl="/playlist"
          props={playlists}
          title="Playlists"
        />
      )}

      {followsInfo.length > 0 && (
        <ProfileOrganizer
          seeMore={hasMoreFollows ? `/user/${userId}/follows` : undefined}
          title="Follows"
          props={followsInfo}
        />
      )}
    </div>
  );
}

type UserDataType = {
  hasMore: boolean;
  userInfo: UserType;
  followsInfo: {
    id: string;
    name: string;
    cover: string;
    isArtist: boolean;
  }[];
};
