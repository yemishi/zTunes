import Carousel from "../components/Slider/Carousel";
import Slider from "../components/Slider/Slider";

async function getData() {
  const response = await fetch("http://localhost:3000/api/album?q=a").then(
    (res) => res.json()
  );
  return response;
}

export default async function Home() {
  const data = await getData();
  return (
    <div className="w-full h-full">
      <Carousel title="popular albums" baseUrl="/album" props={data} />;
    </div>
  );
}
