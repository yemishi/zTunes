import { deleteImage } from "@/firebase/handleImage";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { jsonError, paginate } from "../helpers";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") as string;
  const artistId = req.nextUrl.searchParams.get("artistId") as string;
  const albumId = req.nextUrl.searchParams.get("albumId") as string;
  const take = Number(req.nextUrl.searchParams.get("take")) || 10;
  const page = Number(req.nextUrl.searchParams.get("page")) || 0;
  try {
    if (albumId) {
      const album = await db.album.findUnique({
        where: { id: albumId },
        include: {
          songs: { select: { track: true }, ...paginate(page, take) },
          artist: { select: { profile: { select: { avatar: true } }, username: true } },
        },
      });
      if (!album) return jsonError("Album not found.", 404);
      return NextResponse.json({
        ...album,
        avatar: album.artist.profile?.avatar,
        tracks: album.songs.map((s) => s.track),
        artistName: album.artist.username,
      });
    }

    if (artistId) {
      const albums = await db.album.findMany({
        where: { artistId },
        include: { artist: { select: { username: true } } },
        ...paginate(page, take),
      });

      return NextResponse.json(
        albums.map((a) => {
          return { ...a, artistName: a.artist.username };
        })
      );
    }

    const albums = await db.album.findMany({
      where: {
        title: {
          contains: query || "",
        },
      },
      include: { artist: { select: { username: true } } },
      orderBy: { coverPhoto: "asc" },
      ...paginate(page, take),
    });
    return NextResponse.json(
      albums.map((a) => {
        return { ...a, artistName: a.artist.username };
      })
    );
  } catch (error) {
    return jsonError("We had a problem trying to recover the albums.");
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, releasedDate, coverPhoto, artistId, type, desc } = await req.json();

    const artist = await db.user.findUnique({
      where: { id: artistId },
    });
    if (!artist || !artist.isArtist) return jsonError("Artist not found");

    const unavailableName = await db.album.findFirst({
      where: { artistId, title: { contains: title, mode: "insensitive" } },
    });

    if (unavailableName) return jsonError(`You already have an album named ${title}`);
    await db.album.create({
      data: {
        artistId: artist.id,
        releasedDate,
        title,
        desc,
        coverPhoto,
        type: type || "album",
      },
    });

    return NextResponse.json({ message: "Your album was successfully created." });
  } catch (error) {
    return jsonError("We had a problem trying to create the album");
  }
}

export async function PATCH(req: NextRequest) {
  const albumId = req.nextUrl.searchParams.get("albumId") as string;
  try {
    const { title, coverPhoto, vibrantColor } = await req.json();
    const album = await db.album.findFirst({ where: { id: albumId } });
    if (!album) return jsonError("Album not found");

    if (title || coverPhoto)
      return await updateAlbum(albumId, title ? "title" : "coverPhoto", title || coverPhoto, album.artistId);
    if (vibrantColor) {
      await db.album.update({ where: { id: album.id }, data: { vibrantColor } });
    }
    return NextResponse.json({ message: "Album updated with success" });
  } catch (error) {
    return jsonError("We had a problem trying to updated the album");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { albumId } = await req.json();
    const album = await db.album.findFirst({ where: { id: albumId } });
    if (!album) return jsonError("Album not found");

    const songs = await db.songs.findMany({ where: { albumId } });
    const songIds = songs.map((song) => song.id);
    await db.playlist.updateMany({
      where: { songs: { some: { songId: { in: songIds } } } },
      data: {
        songs: { deleteMany: { where: { songId: { in: songIds } } } },
      },
    });

    const likeList = await db.likedSongs.findMany({
      where: { songs: { hasSome: songIds } },
    });

    const updatePromises = likeList.map(async (res) => {
      const list = await db.likedSongs.findFirst({ where: { id: res.id } });
      const newSongs = list?.songs.filter((e) => !songIds.includes(e));
      await db.likedSongs.update({
        where: { id: res.id },
        data: { songs: newSongs },
      });
    });
    await Promise.all(updatePromises);

    await db.playCount.deleteMany({
      where: { songId: { in: songIds } },
    });
    await db.songs.deleteMany({
      where: { id: { in: songIds } },
    });
    await deleteImage(album.coverPhoto);
    await db.album.delete({ where: { id: albumId } });
    return NextResponse.json({ message: "Album deleted with success" });
  } catch (error) {
    return jsonError("We had a error trying to delete the album");
  }
}

async function updateAlbum(albumId: string, field: string, value: string, artistId: string) {
  try {
    if (field === "title") {
      const existingTitle = await db.album.findFirst({
        where: { id: { not: albumId }, artistId, title: value },
      });
      if (existingTitle) return jsonError("Title is not available");
    }
    await db.album.update({
      where: { id: albumId },
      data: {
        [field]: value,
      },
    });
    const updateField = field === "title" ? "albumName" : field;
    await db.songs.updateMany({
      where: { albumId: albumId },
      data: { [updateField]: value },
    });

    return NextResponse.json({ message: "Album updated with success" });
  } catch (error) {
    return jsonError("We had a problem trying to update the album");
  }
}
