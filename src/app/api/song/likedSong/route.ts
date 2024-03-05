import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const username = req.nextUrl.searchParams.get("username") as string;
    const songId = req.nextUrl.searchParams.get("songId") as string;
    const user = await db.user.findFirst({ where: { username } });

    const likedSongs = await db.likedSongs.findFirst({
      where: { userId: user?.id },
    });

    if (songId) return NextResponse.json(likedSongs?.songs.includes(songId));

    const songs = await db.songs.findMany({
      where: { id: { in: likedSongs?.songs } },
    });
    return NextResponse.json(songs);
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error: true,
      message: "We had a problem trying to retrieve your favorite songs.",
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { songId, username } = await req.json();
    const user = await db.user.findFirst({ where: { username } });

    if (!user)
      return NextResponse.json({
        error: true,
        message: "User not found",
      });

    const likedSongs = await db.likedSongs.findFirst({
      where: { userId: user?.id },
    });

    if (likedSongs?.songs.includes(songId)) {
      const newIds = likedSongs.songs.filter((id) => id !== songId);
      await db.likedSongs.update({
        where: {
          id: likedSongs.id,
        },
        data: {
          songs: newIds,
        },
      });
      return NextResponse.json({ message: "Song removed from your lib" });
    }

    likedSongs?.songs.push(songId);

    await db.likedSongs.update({
      where: {
        id: likedSongs?.id,
      },
      data: {
        songs: likedSongs?.songs,
      },
    });
    return NextResponse.json({ message: "Song added to your library" });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: "We had a problem trying to change your library.",
    });
  }
}
