import { Readable } from "stream";
import { parseStream } from "music-metadata";

export async function getAudioDuration(url: string): Promise<number | null> {
  try {
    const response = await fetch(url);
    if (!response.ok || !response.body) {
      return null;
    }
    const nodeReadableStream = Readable.fromWeb(response.body as any);

    const metadata = await parseStream(nodeReadableStream, undefined, {
      duration: true,
    });
    return metadata.format.duration as number;
  } catch (error) {
    console.error("Error fetching audio duration:", error);
    return null;
  }
}
