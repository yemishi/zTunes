import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const { songId, username } = await req.json();
    const user = await db.user.findFirst({ where: { username } });

    if (!user) {
      return NextResponse.json({ error: true, message: "User not found" });
    }

    const playCount = await db.playCount.findUnique({ where: { songId } });

    if (!playCount)
      return NextResponse.json({
        error: true,
        message: "Music playCount not found",
      });

    const userIndex = playCount.users.findIndex(
      (userPlayed) => userPlayed.userId === user.id
    );

    if (userIndex !== -1) {
      playCount.users[userIndex].count += 1;
    } else {
      playCount.users.push({
        userId: user.id,
        count: 1,
      });
    }

    await db.playCount.update({
      where: { songId },
      data: {
        listenCount: (playCount.listenCount += 1),
        users: playCount.users,
      },
    });

    return NextResponse.json({
      message: "Music playCount updated successfully",
    });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: "Failed when trying to update music playCount",
    });
  }
}
