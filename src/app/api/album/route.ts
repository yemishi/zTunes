import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("q") as string;
    const albums = await db.album.findMany({
      where: {
        title: {
          contains: query,
        },
      },
    });
    return NextResponse.json(albums);
  } catch (error) {
    return NextResponse.json({ error: true, message: `error here ${error}` });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, releasedDate, coverPhoto, artistName } = await req.json();

    const artist = await db.user.findUnique({
      where: { username: artistName },
    });

    const newAlbum = await db.album.create({
      data: {
        artistId: artist?.id as string,
        artistName,
        releasedDate,
        title,
        coverPhoto,
      },
    });
    return NextResponse.json({
      error: false,
      newAlbum,
    });
  } catch (error) {
    console.log("error here", error);
    return NextResponse.json(error);
  }
}
