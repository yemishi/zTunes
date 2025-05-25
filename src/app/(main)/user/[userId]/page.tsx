import ErrorWrapper from "@/components/errorWrapper/ErrorWrapper";
import { ProfileHeader } from "@/components";
import BundleOrganizer from "@/components/bundleGrid/BundleGrid";
import ProfileOrganizer from "@/components/profileGrid/ProfileGrid";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

async function fetchData(userId: string, username: string) {
  const userData = await fetch(`${process.env.URL}/api/user?userId=${userId}&getFollows=true`, {
    next: { revalidate: 7200, tags: ["userInfo", userId] },
  }).then((res) => res.json());
  if (userData.error) {
    if (userData.status === 404) return notFound();
    throw new Error(userData.message);
  }

  const followersInfo = await fetch(`${process.env.URL}/api/followers?username=${username}&artistId=${userId}`, {
    next: { revalidate: 7200, tags: ["userFollowers", userId] },
  }).then((res) => res.json());

  const { followers, userInfo, following, hasMore: hasMoreFollows } = userData;
  const playlistData = await fetch(
    `${process.env.URL}/api/playlist?username=${username}&authorName=${userInfo.name}&limit=5`,
    { next: { revalidate: 7200, tags: ["userPlaylist", userInfo.name] } }
  ).then((res) => res.json());

  return {
    followers,
    following,
    followersInfo,
    userInfo,
    playlistData,
    hasMoreFollows,
  };
}

export default async function UserPage(props0: { params: Promise<{ userId: string }> }) {
  const params = await props0.params;

  const { userId } = params;

  const session = await getServerSession(authOptions);
  const username = session?.user.name as string;

  const { followers, following, followersInfo, userInfo, playlistData, hasMoreFollows } = await fetchData(
    userId,
    username
  );
  const { hasMore, playlists } = playlistData;

  const profileInfo = {
    profileName: userInfo.name,
    profileId: userInfo.id,
    cover: userInfo.avatar,
    vibrantColor: userInfo.vibrantColor,
  };

  return (
    <div className="flex flex-col gap-4">
      <ProfileHeader
        dataTags={["userInfo", userId]}
        username={username}
        profileInfo={profileInfo}
        followersLength={followers.length}
        isInclude={followersInfo.isInclude}
      />
      <ErrorWrapper error={playlistData.error} message={playlistData.message}>
        {playlists.length > 0 && (
          <BundleOrganizer
            seeMore={hasMore ? `/user/${userId}/playlists` : undefined}
            baseUrl="/playlist"
            props={playlists}
            title="Public Playlists"
          />
        )}
      </ErrorWrapper>

      {following.length > 0 && (
        <ProfileOrganizer
          seeMore={hasMoreFollows ? `/user/${userId}/follows` : undefined}
          title="Following"
          props={following}
        />
      )}

      {followers.length > 0 && (
        <ProfileOrganizer
          seeMore={hasMoreFollows ? `/user/${userId}/follows` : undefined}
          title="Followers"
          props={followers}
        />
      )}
    </div>
  );
}
