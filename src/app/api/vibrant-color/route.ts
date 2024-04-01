import { getVibrantColor } from "@/utils/fnc";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const encodedImg = req.nextUrl.searchParams.get("imgUrl") as string;

  const imgUrl = decodeURI(encodedImg);
  try {
    const vibrantColor = await getVibrantColor(imgUrl).then(
      (res) => res?.default
    );

    return NextResponse.json(vibrantColor);
  } catch (error) {
    return NextResponse.json({ error: true, message: "error true" });
  }
}
