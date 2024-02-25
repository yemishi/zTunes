import { db } from "@/lib/db";
import { Songs } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const handleSongs = async (
  song: Songs,
  playlist: {
    songId: string;
    createdAt: Date;
  }[]
) => {
  const { albumId, urlSong, name, id: songId } = song;
  const album = await db.album.findFirst({ where: { id: albumId } });
  if (!album) {
    return NextResponse.json({
      message: "We had a problem trying to get the playlist songs",
    });
  }

  const { artistId, artistName, coverPhoto, title, id } = album;
  const playlistSong = playlist.find((song) => song.songId === songId);

  return {
    createdAt: playlistSong?.createdAt,
    artistId,
    artistName,
    albumTitle: title,
    coverPhoto,
    albumId,
    name,
    urlSong,
  };
};

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id") as string;
    const username = req.nextUrl.searchParams.get("username") as string;
    const user = await db.user.findFirst({ where: { username } });

    const playlist = await db.playlist.findFirst({
      where: { id },
    });

    if (!playlist)
      return NextResponse.json({ error: true, message: "playlist not found" });

    if (!playlist.isPublic) {
      if (playlist.userId !== user?.id)
        return NextResponse.json({
          error: true,
          message: "playlist not found",
        });
    }

    const songsId = playlist?.songs.map((obj) => obj.songId);

    const songs = await db.songs.findMany({
      where: {
        id: {
          in: songsId,
        },
      },
    });
    const songsInfo = await Promise.all(
      songs.map((song) => handleSongs(song, playlist.songs))
    );

    return NextResponse.json(songsInfo);
  } catch (error) {
    return NextResponse.json({
      message: "We had a problem trying to get the playlist songs",
    });
  }
}
