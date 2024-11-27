
import getVibrantColor from "@/utils/getVibrantColor";
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
    return NextResponse.json("transparent");
  }
}
