import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "../../helpers";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username") as string;
  try {
    const user = await db.user.findFirst({ where: { username } });
    if (!user) {
      const playlists = await db.playlist.findMany({
        where: { officialCategories: { isEmpty: false }, isPublic: true },
        take: 10,
      });
      return NextResponse.json(playlists);
    }

    const historicPlayed = await db.playCount.findMany({
      where: { users: { some: { userId: user.id } } },
    });

    const categories = historicPlayed.flatMap((song) => song.category);

    if (categories.length === 0) {
      return NextResponse.json([]);
    }

    const playlists = await db.playlist.findMany({
      where: { officialCategories: { isEmpty: false }, isPublic: true },
      take: 10,
    });

    if (!playlists.length) return NextResponse.json([]);

    const filteredBundle = playlists.filter((playlist) => {
      return playlist.officialCategories.some((category) => categories.includes(category));
    });
    const playlistsMapped = filteredBundle.map((playlist) => {
      const { title, id, coverPhoto } = playlist;
      return {
        isOfficial: true,
        title,
        id,
        coverPhoto,
      };
    });

    return NextResponse.json(playlistsMapped);
  } catch (error) {
    return jsonError("we had a problem trying to get some playlists");
  }
}
