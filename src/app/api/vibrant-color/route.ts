import { getVibrantColor } from "@/app/utils/fnc";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const imgUrl = req.nextUrl.searchParams.get("imgUrl") as string;
  try {
    const vibrantColor = await getVibrantColor(imgUrl);
    return NextResponse.json(vibrantColor.default);
  } catch (error) {
    return NextResponse.json({ error: true, message: "error true" });
  }
}
