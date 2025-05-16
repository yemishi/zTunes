"use client";

import { BiLibrary } from "react-icons/bi";
import { PiHouseLight, PiMagnifyingGlassLight } from "react-icons/pi";
import { Suspense, lazy } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const UserSessionPanel = lazy(() => import("./userSessionPanel/SessionPanel"));
const UserLibPanel = lazy(() => import("./userLibPanel/UserLibPanel"));

export default function Sidebar() {
  const pathName = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const liMapped = [
    { Icon: PiHouseLight, to: "home" },
    { Icon: PiMagnifyingGlassLight, to: "search" },
    { Icon: BiLibrary, to: "myLib", name: "Library" },
  ];

  return (
    <div className="hidden fixed md:flex flex-col left-0 top-0 w-64 lg:w-72 2xl:w-80 min-3xl:w-96 h-full pb-20 p-2 gap-2 bg-black">
      <Suspense fallback={<div className="spinner" />}>
        <UserSessionPanel user={user} />
      </Suspense>
      <ul className="flex flex-col gap-2 p-2 bg-black-700 rounded-lg">
        {liMapped.map(({ Icon, to, name }, i) => {
          const isActive = pathName === `/${to}`;

          return (
            <Link
              key={`${to}_${i}`}
              href={`/${to}`}
              className={`flex ${
                isActive ? "opacity-100" : "opacity-50"
              } gap-2 p-3 items-center font-bold  hover:opacity-100 active:bg-black rounded-lg transition-all`}
            >
              <Icon className={`size-7 ${to === "myLib" ? "" : "stroke-[8px]"}`} />
              <span className="first-letter:uppercase">{name || to}</span>
            </Link>
          );
        })}
      </ul>

      <div className="flex flex-col rounded-lg flex-1 bg-black-700 p-2 overflow-y-auto">
        <Suspense fallback={<div className="spinner" />}>
          <UserLibPanel username={user?.name} />
        </Suspense>
      </div>
    </div>
  );
}
