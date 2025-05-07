"use client";

import { urlMatch } from "@/utils/helpers";
import { BiLibrary } from "react-icons/bi";
import { PiHouseLight, PiMagnifyingGlassLight } from "react-icons/pi";
import { Suspense, lazy } from "react";

import isMobile from "@/utils/isMobile";
import Link from "next/link";

const SessionPanel = lazy(() => import("./SessionPanel"));
const LibInfo = lazy(() => import("./LibInfo"));
export default function Sidebar() {
  const hidden = () =>
    urlMatch("login") || urlMatch("sign-up") || urlMatch("validation") || urlMatch("password-reset") || isMobile();
  if (hidden()) return;
  const liMapped = [
    { Icon: PiHouseLight, to: "home" },
    { Icon: PiMagnifyingGlassLight, to: "search" },
    { Icon: BiLibrary, to: "myLib", name: "Library" },
  ];

  return (
    <div className="fixed left-0 top-0 w-64 lg:w-72 2xl:w-80  min-[2000px]:w-96 h-full pb-20 flex flex-col p-2 gap-2 bg-black">
      <Suspense fallback={<div className="spinner" />}>
        <SessionPanel />
      </Suspense>
      <ul className="flex flex-col gap-2 p-2 bg-black-700 rounded-lg">
        {liMapped.map(({ Icon, to, name }, i) => {
          return (
            <Link
              key={`${to}_${i}`}
              href={`/${to}`}
              className="flex gap-2 p-3 items-center font-bold opacity-50 hover:opacity-100 active:bg-black rounded-lg transition-all "
            >
              <Icon className={`size-7 ${to === "myLib" ? "" : "stroke-[8px]"}`} />
              <span className="first-letter:uppercase">{name || to}</span>
            </Link>
          );
        })}
      </ul>

      <div className="flex flex-col rounded-lg flex-1 bg-black-700 p-2 overflow-y-auto">
        <Suspense fallback={<div className="spinner" />}>
          <LibInfo />
        </Suspense>
      </div>
    </div>
  );
}
