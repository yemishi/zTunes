"use client";

import SignInForm from "@/components/form/SignInForm";
import SignUpForm from "@/components/form/SignUpForm";
import DivAnimated from "@/components/ui/custom/DivAnimated";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [action, setAction] = useState<"signin" | "signup" | "reset-pass">("signin");

  return (
    <div className="flex w-full justify-center">
      <div
        className="bg-gradient-to-bl to-black-800/80 to-80% from-amber-400/60 shadow-xl shadow-black/60 backdrop-blur-sm w-full  
  grid grid-rows-[0.5fr_1px_2fr] grid-cols-1 pt-20 px-8 gap-4 h-screen pb-28 md:pb-0 max-w-[450px] min-[450px]:h-[600px] min-[450px]:rounded-lg overflow-clip md:text-xl md:max-w-[550px]"
      >
        <AnimatePresence mode="wait" initial={false}>
          {action === "signin" && (
            <DivAnimated reverse key="signin-title">
              <h1 className="text-3xl font-montserrat font-bold self-start tracking-tighter">
                Sign in to <span className="text-orange-500">zTunes</span>
              </h1>
            </DivAnimated>
          )}
          {action === "signup" && (
            <DivAnimated key="signup-title">
              <h1 className="text-3xl font-montserrat font-bold self-start tracking-tighter text-left ">
                Sign up to start
                <span className="block sm:inline text-orange-500"> listening</span>
              </h1>
            </DivAnimated>
          )}
        </AnimatePresence>
        <div className="bg-white/60" />
        <AnimatePresence mode="wait" initial={false}>
          {action == "signin" ? (
            <DivAnimated key="signin-form">
              <SignInForm />
            </DivAnimated>
          ) : (
            <DivAnimated reverse key="signup-form">
              <SignUpForm />
            </DivAnimated>
          )}
        </AnimatePresence>
      </div>

      <div className="text-gray-400 absolute bottom-7 flex flex-col items-center">
        <Link
          href="/"
          className="tracking-tighter self-center mb-2 text-white hover:text-orange-600 text-lg md:text-xl font-semibold"
        >
          Go Home
        </Link>
        <span className="border-t py-1 border-white border-opacity-20 w-full" />
        <span className="md:text-lg">
          Don't have an account,
          <button
            onClick={() => setAction(action === "signin" ? "signup" : "signin")}
            className="underline tracking-tighter ml-1 text-white hover:text-orange-600 transition-all cursor-pointer"
          >
            Sign up for zTunes
          </button>
        </span>
      </div>
    </div>
  );
}
