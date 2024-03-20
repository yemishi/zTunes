import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const field = req.nextUrl.searchParams.get("field") as "artist" | "admin";
  try {
    const { userId, cover, summary } = await req.json();
    if (!field)
      return NextResponse.json({
        error: true,
        message: "No field chosen for upgrade",
      });

    const user = await db.user.findFirst({ where: { id: userId } });

    if (!user)
      return NextResponse.json({
        error: true,
        message: "User not found",
      });
    if (field === "admin") {
      await db.user.update({
        where: { id: user.id },
        data: { isAdmin: true },
      });
      return NextResponse.json({ message: "User upgraded with success" });
    }

    await db.user.update({
      where: { id: user.id },
      data: {
        isArtist: { cover, summary },
      },
    });
    return NextResponse.json({ message: "User upgraded with success" });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: "We had a problem trying to upgrade your account",
    });
  }
}
