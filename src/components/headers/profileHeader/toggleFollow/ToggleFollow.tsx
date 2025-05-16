import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BiSolidLogInCircle } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";

export default function ToggleFollow({
  username,
  artistId,
  handleFollows,
  initialValue,
}: {
  artistId: string;
  handleFollows: (isFollowing: boolean) => void;
  username?: string;
  initialValue?: boolean;
}) {
  const [isFollow, setIsFollow] = useState(initialValue);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const ref = useRef<HTMLButtonElement | null>(null);
  const fetchFollow = async () => {
    const newFollowState = !isFollow;
    setIsFollow(newFollowState);
    handleFollows(newFollowState);

    const body = { username, artistId };
    setIsLoading(true);
    await fetch(`/api/followers`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }).catch(() => {
      setIsFollow(!newFollowState);
      handleFollows(!newFollowState);
    });
    setIsLoading(false);
  };
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as HTMLElement;
      if (isLogin && ref.current && !ref.current.contains(target)) {
        setIsLogin(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLogin]);
  const onClick = () => {
    if (!username) {
      setIsLogin(true);
      return;
    }
    fetchFollow();
  };
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`flex font-medium text-lg items-center p-2 relative ${isLoading ? "pointer-events-none" : ""}`}
    >
      {isLogin ? (
        <Link href={`/login?callbackUrl=${pathname}${searchParams.toString() ? "?" + searchParams.toString() : ""}`}>
          <BiSolidLogInCircle className="size-10 hover:brightness-90 active:scale-90 active:brightness-125 transition-all cursor-pointer" />
        </Link>
      ) : (
        <FaHeart
          className={` cursor-pointer transition-all hover:opacity-70 size-8  active:scale-105 ${
            isFollow ? "text-amber-600 " : "text-white opacity-55"
          }`}
        />
      )}
    </button>
  );
}
