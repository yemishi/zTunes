import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  try {
    const { tag } = await req.json();

    const tags = (Array.isArray(tag) ? tag : [tag]).filter((t) => typeof t === "string");

    if (tags.length === 0) {
      return new Response(JSON.stringify({ error: "Missing or invalid tag(s)" }), { status: 400 });
    }

    tags.forEach(revalidateTag);

    return new Response(JSON.stringify({ revalidated: true, tag: tags }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to revalidate" }), { status: 500 });
  }
}
