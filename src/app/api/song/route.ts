import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, urlSong, artistName, category, albumId } = await req.json();

    const artist = await db.user.findUnique({
      where: { username: artistName },
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
