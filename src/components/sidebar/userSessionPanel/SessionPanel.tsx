import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "@/ui/custom/Image";
import Logout from "@/ui/buttons/Logout";

export default function UserSessionPanel() {
  const { data: session } = useSession();
  const user = session?.user;
  if (!user) return;
  return (
    <div className="flex flex-col w-full gap-4 p-2 rounded-lg bg-black-700 ">
      <Link
        href="/account"
        className="flex gap-2 items-center p-2 rounded-r-lg rounded-l-3xl font-bold hover:bg-black-450 duration-150 active:bg-black"
      >
        <Image src={user.picture} alt="User avatar" className="size-12 rounded-3xl" />
        <span className="line-clamp-1 mt-auto mb-2">{user.name.charAt(0).toUpperCase() + user.name.slice(1)}</span>
      </Link>
      <Logout
        animateLess
        className="rounded-lg bg-transparent opacity-50 hover:bg-black-450 hover:opacity-100 duration-100 font-bold active:bg-black"
      />
    </div>
  );
}
