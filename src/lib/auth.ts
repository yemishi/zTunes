import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "./db";
import { compare } from "bcrypt";

export type UserToken = {
  name: String;
  email: String;
  picture: String;
  isAdmin: boolean;
  password?: String;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-in",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "name", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.name || !credentials.password) return null;
        const { name, password } = credentials;
        const existingUser = await db.user.findFirst({
          where: {
            OR: [{ username: { equals: name } }, { email: { equals: name } }],
          },
        });
        if (!existingUser || !existingUser.password) return null;

        const checkPass = await compare(password, existingUser.password);

        if (!checkPass) return null;
        return {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.username,
          image: existingUser.profile?.avatar,
          isAdmin: existingUser.isAdmin,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, trigger, session }) {
      if (trigger === "update" && (session.name || session.picture)) {
        token.name = session.name || token.name;
        token.picture = session.picture || token.name;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        email: token.email as string,
        name: token.name as string,
        picture: token.picture as string,
        isAdmin: !!token.isAdmin,
      };
      return session;
    },
    redirect({ baseUrl, url }) {
      return `${baseUrl}/sign-in`;
    },
  },
};
