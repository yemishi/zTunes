"use server";

import SignInForm from "@/components/form/SignInForm";
import Link from "next/link";

export default async function page() {
  return (
    <div className="formPage">
      <div className="fixed bg-gradient-to-b from-transparent to-black w-full h-full" />
      <SignInForm />

      <div className="text-gray-400 mt-7 fixed bottom-4 flex flex-col items-center">
        <Link
          href="/"
          className="tracking-tighter self-center mb-2 text-white hover:text-orange-600 text-lg md:text-xl font-semibold"
        >
          Go Home
        </Link>
        <span className="border-t py-1 border-white border-opacity-20 w-full" />
        <span className="md:text-lg">
          Don't have an account
          <Link
            href="/sign-up"
            className="underline tracking-tighter ml-1 text-white hover:text-orange-600"
          >
            Sign up for zTunes
          </Link></span>
      </div>
    </div>
  );
}
