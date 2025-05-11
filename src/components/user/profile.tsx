"use server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

type SessionUser = {
  user: {
    name: String;
    picture: String;
    email: String;
    exp: number;
    iat: number;
    sub: String;
    jti: String;
  };
};

async function Profile() {
  const {
    user: { name, picture },
  } = (await getServerSession(authOptions)) as SessionUser;

  return (
    <div className="text-white">
      <p>{name}</p>
      <img src={picture as string} className="w-11 h-11" alt="" />
    </div>
  );
}
