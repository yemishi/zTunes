"use server";

import SignInForm from "@/app/components/form/SignInForm";
import Link from "next/link";

export default async function page() {
  return (
    <div
      className="w-full bg-black h-full bg-[url(/musicBg.jpg)] !bg-no-repeat relative !bg-cover !bg-center flex items-center justify-center
     flex-col"
    >
      <div className="fixed bg-gradient-to-b from-transparent to-black w-full h-full" />

      <SignInForm />

      <span className="text-gray-400 border-t py-3 border-white border-opacity-20 mt-7 fixed bottom-4">
        Don't have an account
        <Link
          href="/sign-up"
          className="underline tracking-tighter ml-1 text-white"
        >
          Sign up for zTunes
        </Link>
      </span>
    </div>
  );
}
