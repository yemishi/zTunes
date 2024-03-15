import { ButtonHTMLAttributes } from "react";
import Button from "./Button";
import { signIn } from "next-auth/react";
import { TiSocialFacebook } from "react-icons/ti";
import { FcGoogle } from "react-icons/fc";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

function FacebookButton({ children, ...props }: ButtonProps) {
  const facebookSigIn = async () => {
    await signIn("facebook", {
      redirect: false,
    });
  };
  return (
    <Button
      onClick={facebookSigIn}
      {...props}
      type="button"
      className="flex items-center gap-4 w-full bg-transparent"
    >
      <TiSocialFacebook className="h-6 w-6 bg-blue-500 rounded-full" />

      {children ? children : "Continue with Facebook"}
    </Button>
  );
}

function GoogleButton({ children, ...props }: ButtonProps) {
  const googleSigIn = async () => {
    await signIn("google", {
      redirect: false,
    });
  };
  return (
    <Button
      onClick={googleSigIn}
      {...props}
      type="button"
      className="flex items-center gap-4 w-full bg-transparent"
    >
      <FcGoogle className="w-6 h-6" />
      {children ? children : "Continue with Google"}
    </Button>
  );
}

export { GoogleButton, FacebookButton };
