import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, urlSong, artistName, category, track, trackType } =
      await req.json();

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
        track,
        trackType,
        urlSong,
        category,
      },
    });
    return NextResponse.json({
      error: false,
      newSong,
    });
  } catch (error) {
    return NextResponse.json({ error: true, message: `error here ${error}` });
  }
}
