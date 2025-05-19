import { db } from "@/lib/db";
import { dateFormat } from "@/utils/formatting";
import { NextRequest, NextResponse } from "next/server";
import { jsonError } from "../helpers";

export async function GET(req: NextRequest) {
  const authorName = req.nextUrl.searchParams.get("authorName") || "";
  const authorId = req.nextUrl.searchParams.get("authorId") || "";
  const username = req.nextUrl.searchParams.get("username") as string;
  const playlistId = req.nextUrl.searchParams.get("playlistId") as string;
  const limit = Number(req.nextUrl.searchParams.get("limit")) || 10;
  const page = Number(req.nextUrl.searchParams.get("page")) || 0;

  try {
    const author = await db.user.findFirst({
      where: authorId ? { id: authorId } : { username: authorName },
    });

    if (!author && !playlistId) return jsonError("Author not found.", 404);

    const user = await db.user.findFirst({ where: { username } });
    if (playlistId) {
      const playlist = await db.playlist.findFirst({
        where: { id: playlistId },
      });
      if (!playlist) return jsonError("Playlist not found.", 404);
      const author = await db.user.findFirst({
        where: { id: playlist.userId },
      });
      const songsId = playlist.songs.map((song) => song.songId);
      const tracks = await db.songs
        .findMany({
          where: { id: { in: songsId } },
          select: { track: true },
        })
        .then((res) => res.map((res) => res.track));
      const info = {
        authorId: author?.id,
        desc: playlist.desc,
        title: playlist.title,
        isOwner: playlist.userId === user?.id,
        author: author?.username,
        isUser: !author?.isArtist,
        isPublic: playlist.isPublic,
        coverPhoto: playlist.coverPhoto,
        avatar: author?.profile?.avatar,
        isOfficial: !!playlist.officialCategories && playlist.officialCategories.length,
        releasedDate: dateFormat(playlist.createdAt),
        vibrantColor: playlist.vibrantColor,
        categories: playlist.officialCategories,
        tracks,
      };
      return NextResponse.json(info);
    }

    const playlistsData = await db.playlist.findMany({
      where: { userId: author?.id },
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
    return jsonError("We had a problem trying to get the playlist songs.");
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, username, isPublic, desc, coverPhoto, officialCategories, songs } = await req.json();

    const user = await db.user.findFirst({ where: { username } });
    if (!user) return jsonError("user not found", 404);

    const existingPlaylist = await db.playlist.findFirst({
      where: { title, userId: user.id },
    });

    if (existingPlaylist) {
      return jsonError("Playlist with this name already exists.");
    }

    await db.playlist.create({
      data: {
        title,
        userId: user.id,
        isPublic,
        coverPhoto,
        desc: desc,
        songs: songs || [],
        ...(officialCategories && { officialCategories }),
      },
    });

    return NextResponse.json({ message: "playlist created successfully" });
  } catch (error) {
    return jsonError("we had a problem trying to create the playlist.");
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, isPublic, officialCategories, title, coverPhoto, force, toRemove, songSelected, vibrantColor, desc } =
      await req.json();

    const playlist = await db.playlist.findUnique({ where: { id } });
    const songs = toRemove
      ? playlist?.songs?.filter(
          (song) =>
            String(song.createdAt) !== String(new Date(songSelected.createdAt)) && song.songId !== songSelected.songId
        )
      : playlist?.songs;

    if (!playlist) return jsonError("Playlist not found.", 404);
    const newSong = {
      createdAt: new Date(),
      songId: songSelected,
    };
    if (songSelected && typeof songSelected === "string") {
      if (!force && songs?.some((song) => song.songId === songSelected))
        return NextResponse.json({
          error: true,
          alreadyIn: true,
          message: "Song already in this playlist",
        });
      songs?.push(newSong);
    }

    if (title) {
      const existingTitle = await db.playlist.findFirst({
        where: {
          userId: playlist?.userId,
          title,
          id: { not: { equals: playlist.id } },
        },
      });
      if (existingTitle) return jsonError("Playlist with this name already exists.");
    }

    await db.playlist.update({
      where: { id },
      data: {
        coverPhoto: coverPhoto || playlist.coverPhoto,
        isPublic: isPublic !== undefined ? isPublic : playlist.isPublic,
        officialCategories: officialCategories || playlist.officialCategories,
        songs,
        desc: desc || playlist.desc,
        title: title || playlist?.title,
        vibrantColor: vibrantColor ?? playlist?.vibrantColor,
      },
    });
    return NextResponse.json({
      newSong: songSelected && !toRemove && newSong,
      message: "playlist updated with successfully",
    });
  } catch (error) {
    console.log(error);
    return jsonError("we had a problem trying to update the playlist.");
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { playlistId } = await req.json();
    await db.playlist.delete({ where: { id: playlistId } });
    return NextResponse.json({ message: "playlist deleted with success" });
  } catch (error) {
    return jsonError("We had a problem trying to delete the playlists.");
  }
}
