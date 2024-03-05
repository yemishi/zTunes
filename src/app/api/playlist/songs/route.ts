import { dateFormat } from "@/app/utils/formatting";
import { db } from "@/lib/db";
import { Songs } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const getSongsInfo = async (
  song: Songs[],
  playlist: {
    songId: string;
    createdAt: Date;
  }
) => {
  const songSelected = song.find(
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
  } = songSelected;

  const album = await db.album.findFirst({ where: { id: albumId } });

  if (!album) {
    return NextResponse.json({
      error: true,
      message: "We had a problem trying to get the playlist songs",
    });
  }

  return {
    id: songId,
    createdAt: playlist?.createdAt,
    artistId,
    artistName,
    albumName: album.title,
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

    const info = {
      avatar: author?.profile?.avatar,
      title: playlist.title,
      author: author?.username,
      coverPhoto: playlist.coverPhoto,
      isUser: !author?.isArtist,
      releasedDate: dateFormat(playlist.createdAt),
      id: author?.id,
      desc: playlist.desc,
      isOfficial: playlist.officialCategories,
      playlistId: playlist.userId === user?.id && playlist.id,
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
      playlist.songs.map((song) => getSongsInfo(songs, song))
    );

    return NextResponse.json({ songs: songsInfo, info });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: "We had a problem trying to get the playlist songs",
    });
  }
}
