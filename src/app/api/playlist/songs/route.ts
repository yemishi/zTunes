import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "../../helpers";


export async function GET(req: NextRequest) {
  const playlistId = req.nextUrl.searchParams.get("playlistId") as string;
  const username = req.nextUrl.searchParams.get("username") as string;
  const take = Number(req.nextUrl.searchParams.get("take")) || 10;
  const page = Number(req.nextUrl.searchParams.get("page")) || 0;
  try {
    if (!playlistId) {
      return jsonError("Missing required query parameters.", 400);
    }
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
      }, orderBy: { name: "asc" },
      skip: page * take,
      take,
    });
  
    const songsMap = new Map(songs.map((song) => [song.id, song]));

    const songsInfo = playlist.songs.map((song) => {
      const songSelected = songsMap.get(song.songId);
      if (!songSelected) return null

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
        createdAt: song.createdAt,
        artistId,
        artistName,
        albumName,
        coverPhoto,
        albumId,
        name,
        urlSong,
      };
    }).filter(Boolean);


    return NextResponse.json({
      songs: songsInfo,
      hasMore: playlist.songs.length > take * (page + 1),
    });
  } catch (error) {
    console.log(error)
    return jsonError("We had a problem trying to get the playlist songs.")
  }
}
