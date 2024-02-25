import { db } from "@/lib/db";
import { Songs } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const username = req.nextUrl.searchParams.get("username") as string;
    const user = await db.user.findFirst({ where: { username } });

    if (!user)
      return NextResponse.json({ error: true, message: "user not found" });

    const playlist = await db.playlist.findMany({
      where: { userId: user.id },
    });

    return NextResponse.json(playlist);
  } catch (error) {
    return NextResponse.json({
      message: "We had a problem trying to get the playlist songs",
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, username, isPublic, coverPhoto, officialCategories } =
      await req.json();

    const user = await db.user.findFirst({ where: { username } });
    if (!user)
      return NextResponse.json({ error: true, message: "user not found" });

    const existingPlaylist = await db.playlist.findFirst({
      where: { title, userId: user.id },
    });

    if (existingPlaylist) {
      return NextResponse.json({ message: "Playlist already exists" });
    }

    await db.playlist.create({
      data: {
        title,
        userId: user.id,
        isPublic,
        coverPhoto,
        officialCategories,
      },
    });

    return NextResponse.json({ message: "playlist created successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "we had a problem trying to create the playlist",
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const {
      id,
      isPublic,
      officialCategories,
      title,
      coverPhoto,
      removeSongs,
      addSongs,
    } = await req.json();

    const playlist = await db.playlist.findUnique({ where: { id } });

    if (addSongs && addSongs.length) {
      addSongs.forEach((newSong: string) => {
        if (!playlist?.songs.some((song) => song.songId === newSong)) {
          playlist?.songs.push({ songId: newSong, createdAt: new Date() });
        }
      });
    }

    await db.playlist.update({
      where: { id },
      data: {
        coverPhoto: coverPhoto || playlist?.coverPhoto,
        isPublic,
        officialCategories,
        songs:
          removeSongs && removeSongs.length
            ? playlist?.songs.filter(
                (song) => !removeSongs.includes(song.songId)
              )
            : playlist?.songs,

        title: title || playlist?.title,
      },
    });
    return NextResponse.json({ message: "playlist updated with successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "we had a problem trying to update the playlist",
    });
  }
}