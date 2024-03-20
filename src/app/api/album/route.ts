import { deleteImage } from "@/firebase/handleImage";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q") as string;
  const artistId = req.nextUrl.searchParams.get("artistId") as string;
  const albumId = req.nextUrl.searchParams.get("albumId") as string;
  try {
    if (albumId) {
      const album = await db.album.findUnique({
        where: { id: albumId },
      });

      if (!album)
        return NextResponse.json({
          error: true,
          message: "Album not found.",
        });

      const artist = await db.user.findUnique({
        where: { id: album?.artistId },
      });

      return NextResponse.json({ ...album, avatar: artist?.profile?.avatar });
    }

    if (artistId) {
      const artist = await db.user.findFirst({ where: { id: artistId } });

      if (!artist || !artist.isArtist)
        return NextResponse.json({
          error: true,
          message: "Artist not found",
        });

      const albums = await db.album.findMany({
        where: { artistId },
      });

      return NextResponse.json(albums);
    }

    const albums = await db.album.findMany({
      where: {
        title: {
          contains: query || "",
        },
      },
    });
    return NextResponse.json(albums);
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: `We had a problem trying to recover the albums`,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, releasedDate, coverPhoto, artistId, type } =
      await req.json();

    const artist = await db.user.findUnique({
      where: { id: artistId },
    });
    if (!artist || !artist.isArtist)
      return NextResponse.json({ error: true, message: "Artist not found" });

    const titleAvailable = await db.album.findFirst({
      where: { artistId, title: { contains: title, mode: "insensitive" } },
    });
    if (titleAvailable)
      return NextResponse.json({
        error: true,
        message: "Title is not available",
      });
    await db.album.create({
      data: {
        artistId: artist.id,
        artistName: artist.username,
        releasedDate,
        title,
        coverPhoto,
        type: type || "album",
      },
    });

    return NextResponse.json({ message: "Album created with success" });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: "We had a problem trying to create the album",
    });
  }
}

export async function PATCH(req: NextRequest) {
  const albumId = req.nextUrl.searchParams.get("albumId") as string;
  try {
    const { title, coverPhoto, releasedDate } = await req.json();
    const album = await db.album.findFirst({ where: { id: albumId } });
    if (!album)
      return NextResponse.json({ error: true, message: "Album not found" });

    if (title || coverPhoto)
      return await updateAlbum(
        albumId,
        title ? "title" : "coverPhoto",
        title || coverPhoto,
        album.artistId
      );

    return NextResponse.json({ message: "Album updated with success" });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: "We had a problem trying to updated the album",
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { albumId } = await req.json();
    const album = await db.album.findFirst({ where: { id: albumId } });
    if (!album)
      return NextResponse.json({
        error: true,
        message: "Album not found",
      });

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
    return NextResponse.json({
      error: true,
      message: "We had a error trying to delete the album",
    });
  }
}

async function updateAlbum(
  albumId: string,
  field: string,
  value: string,
  artistId: string
) {
  try {
    if (field === "title") {
      const availableTitle = await db.album.findFirst({
        where: { id: { not: albumId }, artistId, title: value },
      });
      if (availableTitle)
        return NextResponse.json({
          error: true,
          message: "Title not available",
        });
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
    return NextResponse.json({
      error: true,
      message: "we had a problem trying to update the album",
    });
  }
}
