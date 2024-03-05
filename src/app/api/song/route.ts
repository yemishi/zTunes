import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const albumId = req.nextUrl.searchParams.get("albumId") as string;
  const artistId = req.nextUrl.searchParams.get("artistId") as string;
  const getAll = req.nextUrl.searchParams.get("getAll") as string;
  const songId = req.nextUrl.searchParams.get("songId") as string;

  try {
    if (albumId) {
      const songs = await db.songs.findMany({ where: { albumId } });
      return NextResponse.json(songs);
    }
    if (artistId) {
      const songs = getAll
        ? await db.songs.findMany({ where: { artistId } })
        : await db.songs.findMany({ where: { artistId }, take: 5 });
      return NextResponse.json(songs);
    }
    const song = await db.songs.findUnique({ where: { id: songId } });
    return NextResponse.json(song);
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: "We had a problem trying to recover the songs",
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, urlSong, username, category, albumId, coverPhoto } =
      await req.json();

    const artist = await db.user.findUnique({
      where: { username },
    });
    if (!artist)
      return NextResponse.json({
        error: true,
        message: `something went wrong`,
      });

    const newSong = await db.songs.create({
      data: {
        artistId: artist.id,
        name,
        albumId,
        urlSong,
        category,
        artistName: artist.username,
        coverPhoto,
      },
    });
    await db.playCount.create({
      data: {
        songId: newSong.id,
        category,
        users: [],
      },
    });

    return NextResponse.json({
      message: "Your music has been added with successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: true, message: `error here ${error}` });
  }
}
