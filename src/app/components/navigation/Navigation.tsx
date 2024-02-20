"use client";
import { PiHouseLight } from "react-icons/pi";
import { PiMagnifyingGlassLight } from "react-icons/pi";
import { IoPersonOutline } from "react-icons/io5";
import { BiLibrary } from "react-icons/bi";

import { navbarHidden, urlMatch } from "@/app/utils/fnc";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Navigation() {
  const { data, status } = useSession();
  const user = data?.user;
  if (navbarHidden()) return;
  return (
    <div className="w-full flex items-center justify-around h-16 bg-gradient-to-b  backdrop-brightness-50 fixed bottom-0">
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

      <Link href="/dashboard">
        <IoPersonOutline
          className={`w-6 h-6 text-white ${
            urlMatch("dashboard") ? "opacity-100" : "opacity-50"
          }`}
        />
      </Link>
    </div>
  );
}
