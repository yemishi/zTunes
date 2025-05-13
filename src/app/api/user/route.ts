import { compare } from "bcrypt";
import { deleteImage } from "@/firebase/handleImage";
import { deleteSong } from "@/firebase/handleSong";
import { db } from "@/lib/db";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "../helpers";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") as string;
  const username = req.nextUrl.searchParams.get("username") as string;
  const artistToo = req.nextUrl.searchParams.get("artistToo") === "true";
  const getFollows = req.nextUrl.searchParams.get("getFollows") === "true";

  try {
    const user = await db.user.findFirst({
      where: username ? { username } : { id: userId },
    });

    if (!user || (user.username !== username && user.isArtist && !artistToo)) {
      return jsonError("User not found", 404);
    }

    const userInfo = {
      id: user.id,
      name: user.username,
      isArtist: !!user.isArtist,
      avatar: user.profile?.avatar || null,
      isAdmin: !!user.isAdmin,
      vibrantColor: user.vibrantColor,
    };

    if (!getFollows) {
      return NextResponse.json(userInfo);
    }

    const [following, followersData] = await Promise.all([
      db.user.findMany({
        where: { Followers: { some: { users: { has: user.id } } } },
        select: {
          id: true,
          username: true,
          isArtist: true,
          profile: { select: { avatar: true } },
        },
      }),

      db.followers.findFirst({
        where: { userId: user.id },
        select: { users: true },
      }),
    ]);

    const followersInfo = followersData?.users
      ? await db.user.findMany({
          where: { id: { in: followersData.users } },
          select: {
            id: true,
            username: true,
            isArtist: true,
            profile: { select: { avatar: true } },
          },
        })
      : [];

    const formatUser = (user: any) => ({
      id: user.id,
      name: user.username,
      cover: user.profile?.avatar || null,
      isArtist: !!user.isArtist,
    });

    const formattedFollowing = following.map(formatUser);
    const formattedFollowers = followersInfo.map(formatUser);

    return NextResponse.json({
      userInfo,
      following: formattedFollowing,
      followers: formattedFollowers,
    });
  } catch (error) {
    return jsonError("We had a problem trying to get user info.");
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId, avatar, username, vibrantColor } = await req.json();
    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    await db.user.update({
      where: { id: user?.id },
      data: {
        username: username ?? user?.username,
        profile: avatar ? { avatar, birthDate: user?.profile?.birthDate } : user?.profile,
        vibrantColor: vibrantColor ?? user?.vibrantColor,
      },
    });

    if (user?.isArtist && username) {
      await db.songs.updateMany({
        where: { artistId: user.id },
        data: {
          artistName: username,
        },
      });
    }

    return NextResponse.json({ message: "User updated with success" });
  } catch (error) {
    return jsonError("An error occurred while trying to obtain user information.");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, password } = await req.json();
    const user = await db.user.findFirst({ where: { id: userId } });
    if (!user) return jsonError("User not found.", 404);

    const checkPass = await compare(password, user.password as string);

    if (!checkPass) return jsonError("Password incorrect");

    await deleteArtistDrawer(user);

    const [followers, playlists, searchHistory] = await Promise.all([
      db.followers.findMany({
        where: { users: { has: user.id } },
      }),
      db.playlist.findMany({
        where: { userId: user.id },
      }),
      db.searchHistory.findFirst({
        where: { userId: user.id },
      }),
    ]);
    const followersPromise = followers.map(async (res) => {
      const filteredList = res.users.filter((id) => id !== user.id);
      await db.followers.update({
        where: { id: res.id },
        data: { users: filteredList },
      });
    });

    const playlistPromise = playlists.map(async (res) => {
      await deleteImage(res.coverPhoto);
    });

    await Promise.all([
      ...playlistPromise,
      ...followersPromise,
      db.likedSongs.deleteMany({ where: { userId: user.id } }),
      db.playlist.deleteMany({ where: { userId: user.id } }),
      db.searchHistory.delete({ where: { id: searchHistory?.id } }),
      db.user.delete({ where: { id: user.id } }),
      deleteImage(user.profile?.avatar as string),
    ]);

    return NextResponse.json({ message: "User deleted with success" });
  } catch (error) {
    return jsonError("We had a problem trying to delete the user");
  }
}

async function deleteArtistDrawer(user: User) {
  if (!user.isArtist) return;

  const songs = await db.songs.findMany({ where: { artistId: user.id } });
  const songsIds = songs.map((res) => res.id);
  const likedSongs = await db.likedSongs.findMany({
    where: {
      songs: { hasSome: songsIds },
    },
  });
  const likedPromise = likedSongs.map(async (list) => {
    const filteredList = list.songs.filter((res) => !songsIds.includes(res));
    await db.likedSongs.update({
      where: { id: list.id },
      data: {
        songs: filteredList,
      },
    });
  });
  const songsPromise = songs.map(async (song) => {
    await deleteSong(song.track.url);
  });

  const updatePlaylists = db.playlist.updateMany({
    where: {
      songs: { some: { songId: { in: songsIds } } },
    },
    data: {
      songs: {
        deleteMany: {
          where: {
            songId: { in: songsIds },
          },
        },
      },
    },
  });

  await Promise.all([
    ...likedPromise,
    ...songsPromise,
    db.playCount.deleteMany({
      where: { songId: { in: songsIds } },
    }),
    updatePlaylists,
  ]);

  const albums = await db.album.findMany({ where: { artistId: user.id } });
  const imgPromise = albums.map(async (album) => {
    await deleteImage(album.coverPhoto);
  });
  await Promise.all(imgPromise);
  await db.album.deleteMany({ where: { artistId: user.id } });
  await db.songs.deleteMany({ where: { artistId: user.id } });
  const followers = await db.followers.findFirst({
    where: { userId: user.id },
  });
  await db.followers.delete({ where: { id: followers?.id } });
  await deleteImage(user.isArtist.cover);
}
