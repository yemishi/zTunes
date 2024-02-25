import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const username = req.nextUrl.searchParams.get("username") as string;
    const artistId = req.nextUrl.searchParams.get("artistId") as string;

    const followers = await db.followers.findFirst({
      where: { userId: artistId },
    });

    const user = await db.user.findFirst({ where: { username } });

    return NextResponse.json({
      length: followers?.users.length,
      isInclude: followers?.users.includes(user?.id as string),
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "We had an error trying get the user follower",
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { username, artistId } = await req.json();

    const user = await db.user.findFirst({ where: { username } });

    const followers = await db.followers.findFirst({
      where: { userId: artistId },
    });

    const users = followers?.users;

    if (users?.includes(user?.id as string)) {
      const newUsers = users?.filter((id) => id !== user?.id);
      await db.followers.update({
        where: { id: followers?.id },
        data: {
          users: newUsers,
        },
      });
      return NextResponse.json({
        message: "User unfollow with successfully",
      });
    }

    users?.push(user?.id as string);

    await db.followers.update({
      where: { id: followers?.id },
      data: {
        users,
      },
    });
    return NextResponse.json({ message: "User followed with successfully" });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: "we had an error at trying follow/unfollow the user",
    });
  }
}
