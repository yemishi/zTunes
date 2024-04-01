"use client";

import { lazy, useState } from "react";
import { AnimatePresence } from "framer-motion";
const ForgotPass = lazy(() => import("../login/forgotPass"));
import LoginForm from "../login/loginForm";

export default function SignInForm() {
  const [isForgotPass, setIsForgotPass] = useState<boolean>(false);

  return (
    <div className="mb-7 bg-gradient-to-b from-[#1f1e1a] to-transparent backdrop-blur w-full flex text-center h-full
    flex-col pt-10 px-8 text-white gap-4 max-w-[450px] min-[450px]:h-[600px] min-[450px]:rounded-lg overflow-clip justify-center md:text-xl md:max-w-[550px]">
      <AnimatePresence mode="wait" initial={false}>
        {!isForgotPass && (
          <LoginForm key="manageLogin" close={() => setIsForgotPass(true)} />
        )}

        {isForgotPass && (
          <ForgotPass key="forgotPass" close={() => setIsForgotPass(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
