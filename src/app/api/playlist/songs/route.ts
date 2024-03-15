import { dateFormat } from "@/app/utils/formatting";
import { db } from "@/lib/db";
import { Songs } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const organizerSongInfo = async (
  songs: Songs[],
  playlist: {
    songId: string;
    createdAt: Date;
  }
) => {
  const songSelected = songs.find(
    (song) => song.id === playlist.songId
  ) as Songs;

  const {
    albumId,
    urlSong,
    name,
    id: songId,
    artistId,
    artistName,
    coverPhoto,
    albumName,
  } = songSelected;

  return {
    id: songId,
    createdAt: playlist?.createdAt,
    artistId,
    artistName,
    albumName,
    coverPhoto,
    albumId,
    name,
    urlSong,
  };
};

export async function GET(req: NextRequest) {
  const playlistId = req.nextUrl.searchParams.get("playlistId") as string;
  const username = req.nextUrl.searchParams.get("username") as string;
  try {
    const user = await db.user.findFirst({ where: { username } });
    const playlist = await db.playlist.findUnique({
      where: { id: playlistId },
    });
    if (!playlist)
      return NextResponse.json({ error: true, message: "playlist not found" });

    if (!playlist.isPublic && playlist.userId !== user?.id)
      return NextResponse.json({
        error: true,
        message: "playlist not found",
      });

    const author = await db.user.findUnique({ where: { id: playlist.userId } });
    console.log(playlist.userId, "AAAAAAAAAAAAAA");
    const info = {
      authorId: author?.id,
      desc: playlist.desc,
      title: playlist.title,
      isOwner: playlist.userId === user?.id,
      author: author?.username,
      isUser: !author?.isArtist,
      coverPhoto: playlist.coverPhoto,
      avatar: author?.profile?.avatar,
      isOfficial: playlist.officialCategories,
      releasedDate: dateFormat(playlist.createdAt),
    };

    const songsId = playlist?.songs.map((obj) => obj.songId);

    const songs = await db.songs.findMany({
      where: {
        id: {
          in: songsId,
        },
      },
    });

    const songsInfo = await Promise.all(
      playlist.songs.map((song) => organizerSongInfo(songs, song))
    );

    return NextResponse.json({ songs: songsInfo, info });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: true,
      message: "We had a problem trying to get the playlist songs",
    });
  }
}
