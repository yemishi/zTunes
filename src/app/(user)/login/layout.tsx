import { Metadata } from "next";
import bg from "./assets/musicBg.jpg";
export const metadata: Metadata = {
  title: "Log In | zTunes",
  description: "Log in to your zTunes account and keep the music going.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ background: `url(${bg.src})` }}
      className={`w-full h-full !bg-cover !bg-center !bg-no-repeat flex items-center justify-center
  flex-col`}
    >
      {children}
    </div>
  );
}
