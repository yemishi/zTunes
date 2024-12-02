import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { paginate } from "../helpers";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") as string;
  const username = req.nextUrl.searchParams.get("username") as string;
  const getHistory = req.nextUrl.searchParams.get("getHistory") as string;
  const onlySongs = req.nextUrl.searchParams.get("onlySongs") as string
  const playlistId = req.nextUrl.searchParams.get("playlistId") as string
  const take = Number(req.nextUrl.searchParams.get("take")) || 5
  const page = Number(req.nextUrl.searchParams.get("page")) || 0
  try {
    const user = username ? await db.user.findFirst({ where: { username } }) : null;
    if (getHistory) {

      const searchHistory = await db.searchHistory.findFirst({
        where: { userId: user?.id },
      });
      return NextResponse.json(searchHistory?.historic);
    }

    if (onlySongs) {
      const [count, songs, playlist] = await Promise.all([
        db.songs.count({
          where: { name: { contains: q, mode: "insensitive" } },
        }),
        db.songs.findMany({
          where: { name: { contains: q, mode: "insensitive" } }, ...paginate(page, take)
        }),
        playlistId ? db.playlist.findFirst({ where: { id: playlistId } }) : null
      ])
      const songsMapped = songs.map((song) => {
        const inPlaylist = playlist?.songs.find(({ songId }) => {
          return songId === song.id
        })
        return {
          title: song.name,
          songData: { ...song, songSelected: inPlaylist && inPlaylist },
          coverPhoto: song.coverPhoto,
          refId: song.albumId,
          type: "Album",
          desc: `Music • ${song.albumName}`,
        };
      });
      return NextResponse.json({ songs: songsMapped, hasMore: count > take * (page + 1) })

    }
    const [users, songs, playlistsData, albums] = await Promise.all([
      db.user.findMany({
        where: { username: { contains: q, mode: "insensitive" } },
      }),
      db.songs.findMany({
        where: { name: { contains: q, mode: "insensitive" } },
      }),
      db.playlist.findMany({
        where: { title: { contains: q, mode: "insensitive" } },
      }),
      db.album.findMany({
        where: { title: { contains: q, mode: "insensitive" } }, include: { artist: { select: { username: true } } }
      }),
    ]);

    const playlistsFiltered = playlistsData.filter((playlist) => {
      if (!playlist.isPublic && user) return playlist.userId === user.id;
      return playlist.isPublic;
    });
    const playlistMapped = playlistsFiltered.map((playlist) => {
      return {
        title: playlist.title,
        coverPhoto: playlist.coverPhoto,
        refId: playlist.id,
        type: "Playlist",
      };
    });
    const usersMapped = users.map((user) => {
      return {
        title: user.username,
        coverPhoto: user.isArtist ? user.isArtist.cover : user.profile?.avatar,
        refId: user.id,
        type: user.isArtist ? "Artist" : "User",
      };
    });
    const albumsMapped = albums.map((album) => {
      return {
        title: album.title,
        coverPhoto: album.coverPhoto,
        refId: album.id,
        type: "Album",
        desc: `Album • ${album.artist.username}`,
      };
    });

    const songsMapped = songs.map((song) => {
      return {
        title: song.name,
        songData: song,
        coverPhoto: song.coverPhoto,
        refId: song.albumId,
        type: "Album",
        desc: `Music • ${song.albumName}`,
      };
    });
    return NextResponse.json([
      ...playlistMapped,
      ...usersMapped,
      ...albumsMapped,
      ...songsMapped,
    ]);
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      error: true,
      message: "We had a problem trying to get the search info",
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { username, action, refId, type, coverPhoto, title, desc } =
      await req.json();
    const user = await db.user.findFirst({ where: { username } });
    if (!user)
      return NextResponse.json({ error: true, message: "User not found" });

    const searchHistory = await db.searchHistory.findFirst({
      where: { userId: user.id },
    });
    if (!searchHistory)
      return NextResponse.json({
        error: true,
        message: "Search history not found",
      });

    if (action === "reset") {
      await db.searchHistory.update({
        where: { id: searchHistory?.id },
        data: { historic: [] },
      });
      return NextResponse.json({
        message: "Search historic reset with success",
      });
    }

    if (action === "remove") {
      const newHistoric = searchHistory.historic.filter(
        (res) => res.refId !== refId
      );
      await db.searchHistory.update({
        where: { id: searchHistory.id },
        data: {
          historic: newHistoric,
        },
      });
      return NextResponse.json({
        message: "Search historic updated with success",
      });
    }
    const index = searchHistory.historic.findIndex((e) => e.refId === refId);

    if (index !== -1) searchHistory.historic[index].createdAt = new Date();
    else
      searchHistory.historic.push({
        coverPhoto,
        desc,
        refId,
        type,
        title,
        createdAt: new Date(),
      });

    await db.searchHistory.update({
      where: { id: searchHistory.id },
      data: { historic: searchHistory.historic },
    });
    return NextResponse.json({
      message: "Search historic updated with success",
    });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: "We had a problem trying to updated the historic search",
    });
  }
}
