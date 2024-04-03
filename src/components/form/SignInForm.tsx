"use client";

import { lazy, useState } from "react";
import { AnimatePresence } from "framer-motion";
const ForgotPass = lazy(() => import("../login/forgotPass"));
import LoginForm from "../login/loginForm";

export default function SignInForm() {
  const [isForgotPass, setIsForgotPass] = useState<boolean>(false);

  return (
    <div className="form">
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
