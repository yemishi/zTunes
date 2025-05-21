"use client";

import Link from "next/link";
import { lazy, useState } from "react";
import { AnimatePresence } from "framer-motion";

import DivAnimated from "@/ui/custom/DivAnimated";
import SignInForm from "./signin/SignInForm";
const SignUpForm = lazy(() => import("./signup/SignUpForm"));
const RecoverPassword = lazy(() => import("./recoverPassword/RecoverPassword"));

export default function Login() {
  const [action, setAction] = useState<"signin" | "signup" | "reset-pass">("signin");

  return (
    <div className="flex w-full justify-center">
      <div
        className="w-full h-screen max-md:max-w-[450px] min-md:w-xl min-[450px]:h-[600px] lg:h-[700px]  min-3xl:w-3xl overflow-clip rounded-lg grid grid-rows-[0.5fr_2fr] grid-cols-1
         pt-20 px-8 gap-4 pb-28 md:pb-0 md:text-xl shadow-lg shadow-black/60 backdrop-blur-sm bg-gradient-to-b from-black/80 via-black/60 min-3xl:px-12
         to-black/80 md:to-black/40 md:from-black/60 md:via-black/50"
      >
        <AnimatePresence mode="wait" initial={false}>
          {action === "signin" && (
            <DivAnimated reverse key="signin-title">
              <h1 className="text-3xl min-3xl:text-4xl font-montserrat font-bold self-start tracking-tighter">
                Sign in to <span className="text-orange-500">zTunes</span>
              </h1>
            </DivAnimated>
          )}
          {action === "signup" && (
            <DivAnimated reverse key="signup-title">
              <h1 className="text-3xl min-3xl:text-4xl font-montserrat font-bold self-start tracking-tighter">
                Sign up to start
                <span className="block sm:inline text-orange-500"> listening</span>
              </h1>
            </DivAnimated>
          )}

          {action === "reset-pass" && (
            <DivAnimated key="signup-title">
              <h1 className="text-3xl min-3xl:text-4xl font-montserrat font-bold self-start tracking-tighter">
                Reset your
                <span className="block sm:inline text-orange-500"> password</span>
              </h1>
            </DivAnimated>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          {action === "signin" && (
            <DivAnimated key="signin-form">
              <SignInForm resetPass={() => setAction("reset-pass")} />
            </DivAnimated>
          )}
          {action === "signup" && (
            <DivAnimated key="signup-form">
              <SignUpForm />
            </DivAnimated>
          )}

          {action === "reset-pass" && (
            <DivAnimated reverse key="reset-pass-form">
              <RecoverPassword close={() => setAction("signin")} />
            </DivAnimated>
          )}
        </AnimatePresence>
      </div>

      <div className="text-gray-400 absolute bottom-0 flex flex-col items-center md:mb-4 lg:mb-6">
        <Link
          href="/"
          className="tracking-tighter self-center mb-2 text-white hover:text-amber-300 text-lg md:text-xl font-semibold cursor-pointer"
        >
          Go Home
        </Link>
        <span className="border-t py-1 border-white border-opacity-20 w-full" />
        <span className="md:text-lg md:bg-white/5 md:p-2 rounded-lg">
          Don't have an account,
          <button
            onClick={() => setAction(action === "signin" ? "signup" : "signin")}
            className="underline underline-offset-2 md:underline-offset-4 max-md:tracking-tighter ml-1 text-white hover:text-amber-300 transition-all cursor-pointer"
          >
            Sign up for zTunes
          </button>
        </span>
      </div>
    </div>
  );
}
