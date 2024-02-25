import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createdUserEmail, updatedUserEmail } from "@/app/utils/sendEmail";

export async function GET(req: NextRequest) {
  try {
    const value = req.nextUrl.searchParams.get("value") as string;
    const field = req.nextUrl.searchParams.get("field") as "username" | "email";

    const existingUser = await db.user.findFirst({
      where: {
        [field]: value,
      },
    });
    if (existingUser) {
      return NextResponse.json({
        error: true,
        message: `User with this ${field} already created.`,
      });
    }

    return NextResponse.json({ error: false });
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

    const existingUser = await db.user.findFirst({
      where: { OR: [{ username, email }] },
    });

    if (existingUser) {
      return NextResponse.json({
        error: true,
        message: `User with this name or email already created.`,
      });
    }

    const newUser = await db.user.create({
      data: {
        email,
        username,
        password: hashedPass,
        profile: {
          birthDate,
        },
      },
    });

    await db.followers.create({
      data: {
        userId: newUser.id,
        users: [],
      },
    });

    createdUserEmail(newUser.email, newUser.id);

    return NextResponse.json({
      error: false,
      message: `User created successfully, check your email to validate your account!`,
    });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: `Something went wrong.`,
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

    if (user?.isVerified) {
      console.log("isVerified");
      return NextResponse.json({
        message: "User already verified",
      });
    }

    const userUpdated = await db.user.update({
      where: { id: userId },
      data: {
        isVerified: true,
      },
    });

    updatedUserEmail(userUpdated.email, userUpdated.username);
    return NextResponse.json({
      message: "User updated with successfully",
    });
  } catch (error) {
    return NextResponse.json({ message: "something went wrong." });
  }
}
