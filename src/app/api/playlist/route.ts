import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const authorName = req.nextUrl.searchParams.get("authorName") as string;
  const authorId = req.nextUrl.searchParams.get("authorId") as string;
  const username = req.nextUrl.searchParams.get("username") as string;
  const limit = Number(req.nextUrl.searchParams.get("limit")) || 10;
  const page = Number(req.nextUrl.searchParams.get("page")) || 0;

  try {
    const author = await db.user.findFirst({
      where: { ...(authorName ? { username: authorName } : { id: authorId }) },
    });

    if (!author)
      return NextResponse.json({ error: true, message: "Author not found" });

    const user = await db.user.findFirst({ where: { username } });

    const playlistsData = await db.playlist.findMany({
      where: { userId: author.id },
    });

    const filteredPlaylist = playlistsData.filter((playlist) => {
      if (!playlist.isPublic) {
        if (!user) return false;
        return playlist.userId === user.id;
      }
      return playlist;
    });
    const skip = page * limit;
    const playlists = filteredPlaylist.slice(skip, skip + limit);

    const hasMore = filteredPlaylist.length > skip + limit;

    return NextResponse.json({
      playlists,
      hasMore,
    });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: "We had a problem trying to get the playlist songs",
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      title,
      username,
      isPublic,
      desc,
      coverPhoto,
      officialCategories,
      songs,
    } = await req.json();

    const user = await db.user.findFirst({ where: { username } });
    if (!user)
      return NextResponse.json({ error: true, message: "user not found" });

    const existingPlaylist = await db.playlist.findFirst({
      where: { title, userId: user.id },
    });

    if (existingPlaylist) {
      return NextResponse.json({
        error: true,
        message: "Playlist with this name already exists",
      });
    }

    await db.playlist.create({
      data: {
        title,
        userId: user.id,
        isPublic,
        coverPhoto,
        desc: desc,
        songs,
        ...(officialCategories && { officialCategories }),
      },
    });

    return NextResponse.json({ message: "playlist created successfully" });
  } catch (error) {
    return NextResponse.json({
      error: true,
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

    if (!playlist)
      return NextResponse.json({ error: true, message: "Playlist not found" });

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

    if (title) {
      const existingTitle = await db.playlist.findFirst({
        where: {
          userId: playlist?.userId,
          title,
          id: { not: { equals: playlist.id } },
        },
      });
      if (existingTitle)
        return NextResponse.json({
          error: true,
          message: "Playlist with this name already exists",
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
      error: true,
      message: "we had a problem trying to update the playlist",
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { playlistId } = await req.json();
    await db.playlist.delete({ where: { id: playlistId } });
    return NextResponse.json({ message: "playlist deleted with success" });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: "We had a problem trying to delete the playlists",
    });
  }
}
