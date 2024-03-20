import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id") as string;
  const take = req.nextUrl.searchParams.get("take") as string;
  const offset = req.nextUrl.searchParams.get("offset") as string;

  try {
    if (id) {
      const artistResponse = await db.user.findFirst({
        where: {
          id,
          AND: { isArtist: { isSet: true } },
        },
      });
      if (!artistResponse || !artistResponse.isArtist)
        return NextResponse.json({ error: true, message: "Artist not found" });

      const artist = {
        id: artistResponse.id,
        name: artistResponse.username,
        summary: artistResponse.isArtist?.summary,
        cover: artistResponse.isArtist.cover,
        profile: artistResponse.profile,
      };
      return NextResponse.json(artist);
    }

    const skip = (Number(offset) || 0) * (Number(take) || 10);

    const artists = await db.user.findMany({
      where: {
        isArtist: { isSet: true },
      },
      skip,
      take: skip + (Number(take) || 10),
    });

    const organizeArtists = artists.map((artist) => {
      return {
        id: artist.id,
        name: artist.username,
        cover: artist.isArtist?.cover,
        isArtist: true,
      };
    });

    return NextResponse.json(organizeArtists || []);
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: "We had a problem retrieving artist information",
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId, cover, summary } = await req.json();
    const user = await db.user.findFirst({ where: { id: userId } });

    if (!user || !user.isArtist)
      return NextResponse.json({ error: true, message: "artist not found" });

    await db.user.update({
      where: { id: user?.id },
      data: {
        isArtist: {
          cover: cover || user.isArtist.cover,
          summary: summary || user.isArtist.summary,
        },
      },
    });

    return NextResponse.json({ message: "Artist updated with successfully" });
  } catch (error) {
    return NextResponse.json({
      message: "We had a problem trying to updated artist information",
    });
  }
}
