"use client";

import ForgotPass from "../login/forgotPass";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import LoginForm from "../login/loginForm";

export default function SignInForm() {
  const [isForgotPass, setIsForgotPass] = useState<boolean>(false);

  return (
    <div className="formContainer ">
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
