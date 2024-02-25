import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id") as string;
    const getAll = req.nextUrl.searchParams.get("getAll") as string;

    if (getAll) {
      const artists = await db.user.findMany({
        where: {
          isArtist: { isSet: true },
        },
      });
      const organizeArtists = artists.map((artist) => {
        return {
          id: artist.id,
          name: artist.username,
          about: artist.isArtist?.about,
          cover: artist.isArtist?.cover,
          profile: artist.profile,
        };
      });

      return NextResponse.json(organizeArtists || []);
    }

    const user = await db.user.findFirst({
      where: {
        id,
        AND: { isArtist: { isSet: true } },
      },
    });

    if (!user)
      return NextResponse.json({ error: true, message: "User is not artist." });

    const artist = {
      id: user.id,
      name: user.username,
      about: user.isArtist?.about,
      cover: user.isArtist?.cover,
      profile: user.profile,
    };

    return NextResponse.json(artist);
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: "We had a problem retrieving artist information",
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { username, cover, about } = await req.json();
    const user = await db.user.findFirst({ where: { username } });

    if (!user)
      return NextResponse.json({ error: true, message: "user not found" });
    if (user.isArtist) {
      return NextResponse.json({
        error: true,
        message: "You already is artist.",
      });
    }

    await db.user.update({
      where: { id: user?.id },
      data: {
        isArtist: { cover, about },
      },
    });

    return NextResponse.json({ message: "User updated with successfully" });
  } catch (error) {
    return NextResponse.json({
      message: "We had a problem retrieving artist information",
    });
  }
}
