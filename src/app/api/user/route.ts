import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId") as string;
  const limit = Number(req.nextUrl.searchParams.get("limit")) || 10;
  const page = Number(req.nextUrl.searchParams.get("page")) || 0;
  const getFollows = req.nextUrl.searchParams.get("getFollows") as string;

  try {
    const user = await db.user.findFirst({ where: { id: userId } });

    if (!user || user.isArtist)
      return NextResponse.json({ error: true, message: "User not found" });

    const userInfo = {
      id: user.id,
      name: user.username,
      avatar: user.profile?.avatar,
    };

    if (!getFollows) return NextResponse.json(userInfo);

    const followsData = await db.followers.findMany({
      where: {
        users: { has: user.id },
      },
    });
    const skip = page * limit;

    const followsResponse = await db.user.findMany({
      where: { id: { in: followsData.map((ele) => ele.userId) } },
    });
    const followsSliced = followsResponse.slice(skip, skip + limit);

    const followsInfo = followsSliced.map((user) => {
      return {
        id: user.id,
        name: user.username,
        cover: user.profile?.avatar,
        isArtist: !!user.isArtist,
      };
    });

    return NextResponse.json({
      followsInfo,
      userInfo,
      hasMore: followsData.length > skip + limit,
    });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: "We had a problem trying to get user info",
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId, avatar, username } = await req.json();
    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    await db.user.update({
      where: { id: user?.id },
      data: {
        username: username ? username : user?.username,
        profile: avatar
          ? { avatar, birthDate: user?.profile?.birthDate }
          : user?.profile,
      },
    });

    return NextResponse.json({ message: "User updated with success" });
  } catch (error) {
    return NextResponse.json({ error: true, message: "something went wrong." });
  }
}
