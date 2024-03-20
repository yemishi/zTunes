import { redefinedPassEmail, resetPassEmail } from "@/app/utils/sendEmail";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET(req: NextRequest) {
  try {
    const value = req.nextUrl.searchParams.get("value") as string;
    const user = await db.user.findFirst({
      where: { OR: [{ username: value }, { email: value }] },
    });
    if (!user)
      return NextResponse.json({
        error: true,
        message: "User not found",
      });

    resetPassEmail(user.email, user.username, user.id);

    return NextResponse.json({
      error: false,
      message:
        "We sent you an email. Follow the instructions to get back into your account.",
    });
  } catch (error) {
    return NextResponse.json({
      error: true,
      message: "We had a problem tying to get your account",
    });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { password, userId } = await req.json();
    const passHashed = bcrypt.hashSync(password, 10);
    const user = await db.user.update({
      where: { id: userId },
      data: { password: passHashed },
    });
    redefinedPassEmail(user.email, user.username);

    return NextResponse.json({
      message: `We're happy to inform you that your password has been changed
      successfully. Your account is now secured with the updated
      credentials.`,
    });
  } catch (error) {
    return NextResponse.json({
      message: "something went wrong",
      error: true,
    });
  }
}
