import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET(req: NextRequest) {
  const value = req.nextUrl.searchParams.get("value") as string;
  const field = req.nextUrl.searchParams.get("field") as "username" | "email";
  const isAvailable = req.nextUrl.searchParams.get("isAvailable") as string;
  try {
    const existingUser = await db.user.findFirst({
      where: {
        username: {
          equals: value,
          mode: field === "username" ? "insensitive" : "default",
        },
        AND: {
          isVerified: { isSet: true },
        },
      },
    });
    if (isAvailable) return NextResponse.json(!!existingUser);

    if (existingUser) {
      return NextResponse.json({
        error: true,
        message: `User with this ${field} already existing.`,
      });
    }

    return NextResponse.json({
      message: `This ${field} is available, you can continue.`,
    });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: `Something went wrong.`,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { username, email, password, birthDate } = await req.json();
    const hashedPass = bcrypt.hashSync(password, 10);

    const newUser = await db.user.create({
      data: {
        email,
        username,
        password: hashedPass,
        profile: {
          birthDate,
        },
        isVerified: true,
      },
    });

    await Promise.all([
      await db.followers.create({
        data: {
          userId: newUser.id,
          users: [],
        },
      }),
      await db.searchHistory.create({
        data: {
          userId: newUser.id,
          historic: [],
        },
      }),
    ]);

    return NextResponse.json({
      message: `User created successfully, you can do sign in now`,
    });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: "We had a problem trying to create the user",
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await req.json();
    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (user?.isVerified)
      return NextResponse.json({
        message: "User already verified",
      });

    return NextResponse.json({
      message: "User updated with successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: true, message: "something went wrong." });
  }
}
