"use client";
import { useColor } from "color-thief-react";
import { useRef, useState } from "react";
import Image from "next/image";
import getImageColor from "./components/getImageColor";

export default function Home() {
  console.log(process.env.API_KEY,"test")
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const ref = useRef<HTMLAudioElement>(null);
  const imgSrc =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCtvXQDrxwnd-sdVUN6Detw-f776AWk27v8AiXoF6RJg&s";
  const { data, loading, error } = useColor(imgSrc, "rgbString", {
    crossOrigin: "anonymous",
  });
  
  const handleAudio = () => {
    if (isPlaying) {
      ref.current?.pause();
      setIsPlaying(false);
    } else {
      ref.current?.play();
      setIsPlaying(true);
    }
  };

  return (
    <div>
      <button onClick={handleAudio}>{isPlaying ? "pause" : "play"}</button>
      <audio
        src="https://firebasestorage.googleapis.com/v0/b/ztunes-695af.appspot.com/o/endingChansawMan.mp3?alt=media&token=52ac1c4d-8a3e-4852-b585-8be71a844b58"
        ref={ref}
      />
      <input type="range" name="" id="" />

      <Image
        loader={() => imgSrc}
        src={imgSrc}
       style={{boxShadow:`0 0 50px ${data}`}}
        width={300}
        height={300}
        alt="test"
        className={`shadow-lg   `}
      />
    </div>
  );
}
