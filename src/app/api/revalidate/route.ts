import { revalidateTag } from "next/cache";

export async function POST(req: Request) {
  try {
    const { tag } = await req.json();

    if (!tag) {
      return new Response(JSON.stringify({ error: "Missing tag(s)" }), { status: 400 });
    }

    const tags = Array.isArray(tag) ? tag : [tag];

    for (const t of tags) {
      if (typeof t === "string") {
        revalidateTag(t);
      }
    }

    return new Response(JSON.stringify({ revalidated: true, tag: tags }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to revalidate" }), { status: 500 });
  }
}
