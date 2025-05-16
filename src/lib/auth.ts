import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import { compare } from "bcrypt";

export type UserToken = {
  name: String;
  email: String;
  picture: String;
  password?: String;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.JWT_SECRET,

  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
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
          isAdmin: !!existingUser.isAdmin,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, trigger, session, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      if (trigger === "update" && session) {
        token.name = session.name || token.name;
        token.picture = session.picture || token.picture;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        email: token.email as string,
        name: token.name as string,
        picture: token.picture as string,
      };
      return session;
    },
    redirect({ baseUrl, url }) {
      if (url.startsWith("http")) return url;
      return `${baseUrl}${url}`;
    },
  },
};
