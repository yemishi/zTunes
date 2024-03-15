import Link from "next/link";
import Image from "../ui/Image";
import isMobile from "@/app/utils/isMobile";
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
      className={`items-center px-4 py-2 justify-between ${
        isMobile()
          ? "w-44 h-52"
          : "h-64  bg-black-500 flex-1 py-5 max-w-64 min-w-[150px]"
      }  flex flex-col rounded-lg hover:bg-black-450 active:bg-black-450 "
          }`}
    >
      <Image
        src={cover}
        className={`${
          isMobile() ? "h-36 w-36" : "w-44 h-44"
        } rounded-full shadow-lg shadow-gray-950 object-`}
      />
      <span className="font-poppins first-letter:uppercase  line-clamp-1">
        {name}
      </span>
    </Link>
  );
}
