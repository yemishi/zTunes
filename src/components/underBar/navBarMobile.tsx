import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiLibrary } from "react-icons/bi";
import { IoPersonOutline } from "react-icons/io5";
import { PiHouseLight, PiMagnifyingGlassLight } from "react-icons/pi";
/* import { urlMatch } from "@/utils/helpers";
 */
export default function NavBarMobile() {
  const links = {
    "/home": PiHouseLight,
    "/search": PiMagnifyingGlassLight,
    "/myLib": BiLibrary,
    "/account": IoPersonOutline,
  };
  const pathname = usePathname();
  return (
    <div className="w-full md:hidden flex items-center justify-around h-16 backdrop-brightness-[20%] backdrop-blur-sm md:">
      {Object.entries(links).map(([path, Icon], i) => {
        const isActive = pathname.includes(path);
        return (
          <Link key={`${path}_${i}`} href={path}>
            <Icon className={`size-6 stroke-2 text-white ${isActive ? "opacity-100" : "opacity-50"}`} />
          </Link>
        );
      })}
    </div>
  );
}
