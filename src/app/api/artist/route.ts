import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "../helpers";

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
      if (!artistResponse || !artistResponse.isArtist) return jsonError("Artist not found.", 404);

      const artist = {
        id: artistResponse.id,
        name: artistResponse.username,
        summary: artistResponse.isArtist?.summary,
        cover: artistResponse.isArtist.cover,
        profile: artistResponse.profile,
        vibrantColor: artistResponse.vibrantColor,
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
    return jsonError("We had a problem retrieving artist information.");
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId, cover, summary } = await req.json();
    const user = await db.user.findFirst({ where: { id: userId } });

    if (!user || !user.isArtist) return jsonError("artist not found.", 404);

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
    return jsonError("We had a problem trying to updated artist information.");
  }
}
