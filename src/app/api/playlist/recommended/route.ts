import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username") as string;
  try {
    const user = await db.user.findFirst({ where: { username } });
    if (!user) {
      return NextResponse.json({ error: true, message: "User not found" });
    }

    const historicPlayed = await db.playCount.findMany({
      where: { users: { some: { userId: user.id } } },
    });

    const categories = historicPlayed.flatMap((song) => song.category);

    if (categories.length === 0) {
      return NextResponse.json({
        error: true,
        message: "No categories in the user's history",
      });
    }

    const playlists = await db.playlist.findMany({
      where: { officialCategories: { isEmpty: false } },
    });

    const filteredBundle = playlists.filter((playlist) => {
      return playlist.officialCategories.some((category) =>
        categories.includes(category)
      );
    });
    const playlistsCharge = filteredBundle.map((playlist) => {
      const { title, id, coverPhoto } = playlist;
      return {
        title,
        id,
        coverPhoto,
      };
    });

    return NextResponse.json(playlistsCharge);
  } catch (error) {
    return NextResponse.json({ error: true, message: "we had a problem" });
  }
}
