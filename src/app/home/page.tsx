import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Carousel from "../components/Slider/Carousel";

async function getData() {
  const response = await fetch("http://localhost:3000/api/album?q=a").then(
    (res) => res.json()
  );
  return response;
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const recommendedPlaylists: {
    songs: [];
    isOfficial: { title: string; category: string[] };
    title: string;
    id: string;
    userId: string;
    coverPhoto: string;
  }[] = await fetch(
    `${process.env.URL}/api/playlist/recommended?username=${session?.user.name}`
  ).then((res) => res.json());

  const propsRecommended = recommendedPlaylists.map((playlist) => {
    const { coverPhoto, id, isOfficial, songs, title, userId } = playlist;
    return { title, id, coverPhoto };
  });

  const data = await getData();
  return (
    <div className="w-full h-full">
      <Carousel title="popular albums" baseUrl="/album" props={data} />;
      <Carousel title="Recommended musics" baseUrl="/album" props={propsRecommended} />;
    </div>
  );
}
