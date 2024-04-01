import { useEffect, useState } from "react";

export default function isMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(
    (process.env.NODE_ENV === "development" || typeof window === "undefined"
      ? 0
      : window.innerWidth) <= 768
  );

  const handleSizeChange = () => setIsMobile(window.innerWidth <= 768);
  useEffect(() => {
    window.addEventListener("resize", handleSizeChange);
    return () => {
      window.removeEventListener("resize", handleSizeChange);
    };
  }, []);

  return isMobile;
}
