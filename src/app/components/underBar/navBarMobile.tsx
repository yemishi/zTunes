import Link from "next/link";
import { BiLibrary } from "react-icons/bi";
import { IoPersonOutline } from "react-icons/io5";
import { PiHouseLight, PiMagnifyingGlassLight } from "react-icons/pi";
import { navbarHidden, urlMatch } from "@/app/utils/fnc";

export default function NavBarMobile() {
  if (navbarHidden()) return;
  return (
    <div className="w-full flex items-center justify-around h-16 bg-gradient-to-b backdrop-brightness-50">
      <Link href="/home">
        <PiHouseLight
          className={`w-6 h-6 text-white ${
            urlMatch("home") ? "opacity-100" : "opacity-50"
          }`}
        />
      </Link>

      <Link href="/search">
        <PiMagnifyingGlassLight
          className={`w-6 h-6 text-white ${
            urlMatch("search") ? "opacity-100" : "opacity-50"
          }`}
        />
      </Link>

      <Link href="/myLib">
        <BiLibrary
          className={`w-6 h-6 text-white ${
            urlMatch("myLib") ? "opacity-100" : "opacity-50"
          }`}
        />
      </Link>

      <Link href="/account">
        <IoPersonOutline
          className={`w-6 h-6 text-white ${
            urlMatch("account") ? "opacity-100" : "opacity-50"
          }`}
        />
      </Link>
    </div>
  );
}
