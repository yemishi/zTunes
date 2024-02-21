import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const username = req.nextUrl.searchParams.get("username") as string;
    const user = await db.user.findFirst({ where: { username } });

    if (!user) {
      return NextResponse.json({ message: "User not found" });
    }

    const historicPlayed = await db.playCount.findMany({
      where: { users: { some: { userId: user.id } } },
    });

    const categories = historicPlayed.flatMap((song) => song.category);

    if (categories.length === 0) {
      return NextResponse.json({
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

    return NextResponse.json(filteredBundle);
  } catch (error) {
    return NextResponse.json({ message: "We had a problem" });
  }
}
