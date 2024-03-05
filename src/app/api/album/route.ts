import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("q") as string;
    const artistId = req.nextUrl.searchParams.get("artistId") as string;
    const albumId = req.nextUrl.searchParams.get("albumId") as string;

    if (albumId) {
      const album = await db.album.findUnique({
        where: { id: albumId },
      });
      const artist = await db.user.findUnique({
        where: { id: album?.artistId },
      });

      return NextResponse.json(
        { ...album, avatar: artist?.profile?.avatar } || {
          error: true,
          message: "Album not found.",
        }
      );
    }

    if (artistId) {
      const albums = await db.album.findMany({
        where: { artistId },
      });

      return NextResponse.json(
        albums || {
          error: true,
          message: "We had a problem trying to recover this artist's albums.",
        }
      );
    }

    const albums = await db.album.findMany({
      where: {
        title: {
          contains: query || "",
        },
      },
    });
    return NextResponse.json(albums);
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: `We had a problem trying to recover the albums`,
    });
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
