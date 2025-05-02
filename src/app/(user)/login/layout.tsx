import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In | zTunes",
  description: "Log in to your zTunes account and keep the music going.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full bg-[url('./assets/musicBg.jpg')] h-full bg-no-repeat relative bg-cover bg-center flex items-center justify-center
  flex-col"
    >
      {children}
    </div>
  );
}
