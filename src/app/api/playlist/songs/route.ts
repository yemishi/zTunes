import { db } from "@/lib/db";
import { dateFormat } from "@/utils/formatting";
import { Songs } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "../../helpers";

const organizerSongInfo = async (
  songs: Songs[],
  curSong: {
    songId: string;
    createdAt: Date;
  }
) => {
  const songSelected = songs.find(
    (song) => song.id === curSong.songId
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
    createdAt: curSong?.createdAt,
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
  const take = Number(req.nextUrl.searchParams.get("take")) || 10;
  const page = Number(req.nextUrl.searchParams.get("page")) || 0;
  try {
    const user = await db.user.findFirst({ where: { username } });
    const playlist = await db.playlist.findUnique({
      where: { id: playlistId },
      select: { songs: true, isPublic: true, userId: true },
    });
    if (!playlist || (!playlist.isPublic && playlist.userId !== user?.id))
      return jsonError("playlist not found.", 404)

    const songsId = playlist?.songs.map((obj) => obj.songId);

    const songs = await db.songs.findMany({
      where: {
        id: {
          in: songsId,
        },
      },
      skip: page * take,
      take,
    });

    const songsInfo = await Promise.all(
      playlist.songs.map((song) => organizerSongInfo(songs, song))
    );
    return NextResponse.json({
      songs: songsInfo,
      hasMore: playlist.songs.length > take * (page || 1),
    });
  } catch (error) {
    return jsonError("We had a problem trying to get the playlist songs.")
  }
}
