"use client";
import { urlMatch } from "@/utils/fnc";
import { BiLibrary } from "react-icons/bi";
import { PiHouseLight, PiMagnifyingGlassLight } from "react-icons/pi";
import { Suspense, lazy } from "react";

import isMobile from "@/utils/isMobile";
import Link from "next/link";

const SessionPanel = lazy(() => import("./SessionPanel"));
const LibInfo = lazy(() => import("./LibInfo"));
export default function Sidebar() {
  const hidden = () =>
    urlMatch("sign-in") ||
    urlMatch("sign-up") ||
    urlMatch("validation") ||
    urlMatch("password-reset") ||
    isMobile();
  if (hidden()) return;

  return (
    <div className="fixed left-0 top-0 w-64 lg:w-72 2xl:w-80  min-[2000px]:w-96 h-full pb-20 flex flex-col p-2 gap-2 bg-black">
      <Suspense fallback={<div className="spinner" />}>
        <SessionPanel />
      </Suspense>

      <LinkList />
      <div className="flex flex-col rounded-lg flex-1 bg-black-700 p-2 overflow-y-auto">
        <Suspense fallback={<div className="spinner" />}>
          <LibInfo />
        </Suspense>
      </div>
    </div>
  );
}

const LinkList = () => {
  const liStyle =
    "flex gap-2 p-3 items-center font-bold text-white opacity-50 duration-100 hover:opacity-100 active:bg-black rounded-lg";
  return (
    <ul className="flex flex-col gap-2 p-2 bg-black-700 rounded-lg">
      <li>
        <Link href="/home" className={liStyle}>
          <PiHouseLight className="size-7 stroke-[8px]" />
          <span>Home</span>
        </Link>
      </li>
      <li>
        <Link href="/search" className={liStyle}>
          <PiMagnifyingGlassLight className="size-7" />
          <span>Search</span>
        </Link>
      </li>
      <li>
        <Link href="/myLib" className={liStyle}>
          <BiLibrary className="size-7" />
          <span>Library</span>
        </Link>
      </li>
    </ul>
  );
};
