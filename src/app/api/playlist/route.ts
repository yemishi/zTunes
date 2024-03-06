import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authorName = req.nextUrl.searchParams.get("author") as string;
  const username = req.nextUrl.searchParams.get("username") as string;
  try {
    const author = await db.user.findFirst({ where: { username: authorName } });
    const user = await db.user.findFirst({ where: { username } });

    if (!author)
      return NextResponse.json({ error: true, message: "user not found" });

    const playlist = await db.playlist.findMany({
      where: { userId: author.id },
    });

    const filteredPlaylist = playlist.filter((playlist) => {
      if (!playlist.isPublic) {
        if (!user) return false;
        return playlist.userId === user.id;
      }
      return playlist;
    });

    return NextResponse.json(filteredPlaylist);
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
      force,
      toRemove,
      songSelected,
    } = await req.json();

    const playlist = await db.playlist.findUnique({ where: { id } });
    const songs = playlist?.songs;

    if (songSelected && typeof songSelected === "string") {
      if (!force && songs?.some((song) => song.songId === songSelected))
        return NextResponse.json({
          error: true,
          alreadyIn: true,
          message: "Song already in this playlist",
        });
      songs?.push({
        createdAt: new Date(),
        songId: songSelected,
      });
    }

    await db.playlist.update({
      where: { id },
      data: {
        coverPhoto: coverPhoto || playlist?.coverPhoto,
        isPublic,
        officialCategories,
        songs: toRemove
          ? songs?.filter(
              (song) =>
                song.createdAt === songSelected.createdAt &&
                song.songId === songSelected.songId
            )
          : songs,
        title: title || playlist?.title,
      },
    });
    return NextResponse.json({ message: "playlist updated with successfully" });
  } catch (error) {
    return NextResponse.json({
      message: "we had a problem trying to update the playlist",
    });
  }
}
