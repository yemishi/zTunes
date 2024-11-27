import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { jsonError, paginate } from "../helpers";

export async function GET(req: NextRequest) {
  const albumId = req.nextUrl.searchParams.get("albumId") as string;
  const artistId = req.nextUrl.searchParams.get("artistId") as string;
  const take = Number(req.nextUrl.searchParams.get("take")) || 10;
  const page = Number(req.nextUrl.searchParams.get("page")) || 0;
  const songId = req.nextUrl.searchParams.get("songId") as string;

  try {
    if (artistId || albumId) {
      const [count, songs] = await Promise.all([
        db.songs.count({ where: albumId ? { albumId } : { artistId } }),
        db.songs.findMany({
          where: albumId ? { albumId } : { artistId },
          orderBy: { name: "asc" },
          ...paginate(page, take),
        }),
      ]);
      return NextResponse.json({
        songs,
        hasMore: count > take * (page || 1),
      });
    }

    const song = await db.songs.findUnique({ where: { id: songId } });
    return NextResponse.json(song);
  } catch (error) {
    return jsonError("We had a problem trying recover the songs.")
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, urlSong, artistId, category, albumId } = await req.json();

    const artist = await db.user.findUnique({
      where: { id: artistId },
    });

    if (!artist)
      return NextResponse.json({
        error: true,
        message: `Artist not found`,
      });

    const album = await db.album.findFirst({ where: { id: albumId } });
    if (!album)
      return NextResponse.json({ error: true, message: "Album not found" });

    const availableName = await db.songs.findFirst({
      where: { albumId, name: { equals: name, mode: "insensitive" } },
    });

    if (availableName)
      return NextResponse.json({
        error: true,
        message: "Name is not available",
      });

    const newSong = await db.songs.create({
      data: {
        artistId,
        name,
        albumId,
        albumName: album.title,
        urlSong,
        category,
        artistName: artist.username,
        coverPhoto: album.coverPhoto,
      },
    });
    await db.playCount.create({
      data: {
        songId: newSong.id,
        category,
        users: [],
      },
    });

    return NextResponse.json({
      message: "Your music has been added with successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: true, message: `error here ${error}` });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { songId, albumId, name } = await req.json();
    if (!name)
      return NextResponse.json({ error: true, message: "Invalid name" });

    const availableName = await db.songs.findFirst({
      where: { albumId, name: { equals: name, mode: "insensitive" } },
    });

    if (availableName)
      return NextResponse.json({
        error: true,
        message: "Name is not available",
      });

    await db.songs.update({
      where: { id: songId, albumId },
      data: {
        name,
      },
    });

    return NextResponse.json({ message: "Song updated with success" });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: "We had a problem trying to update the song",
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { songId, artistId } = await req.json();

    const likedList = await db.likedSongs.findMany({
      where: { songs: { has: songId } },
    });

    const updatePromises = likedList.map(async (list) => {
      const newList = list.songs.filter((id) => id !== songId);
      await db.likedSongs.update({
        where: { id: list.id },
        data: {
          songs: newList,
        },
      });
    });

    await Promise.all(updatePromises);
    await db.playCount.delete({ where: { songId } });
    await db.songs.delete({ where: { id: songId, artistId } });
    await db.playlist.updateMany({
      where: { songs: { some: { songId } } },
      data: {
        songs: { deleteMany: { where: { songId } } },
      },
    });

    return NextResponse.json({ message: "Song deleted with success" });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: "We ha a problem trying to delete the song",
    });
  }
}
