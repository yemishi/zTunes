import Link from "next/link";
import Image from "../ui/custom/Image";

type PropsType = {
  cover: string;
  id: string;
  name: string;
  isArtist: boolean;
};
export default function ProfileCard({
  props: { cover, id, isArtist, name },
}: {
  props: PropsType;
}) {
 return (
    <Link
      href={`/${isArtist ? "artist" : "user"}/${id}`}
      className="flex flex-col items-center px-4 py-2 justify-between w-44 h-52  md:py-5 md:bg-black-500  md:w-60 md:min-w-52 md:h-64 
      rounded-lg hover:bg-black-450 active:bg-black-450"
    >
      <Image
        src={cover}
        className="h-36 w-36 md:w-44 md:h-44 rounded-full object-cover shadow-lg shadow-gray-950"
      />
      <span className="font-poppins line-clamp-1">
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </span>
    </Link>
  );
}
