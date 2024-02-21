import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db";
import { compare } from "bcrypt";
import { authByClick } from "./utils/authByClick";

export type UserToken = {
  name: String;
  email: String;
  picture: String;
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
    signOut: "/sign-out",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "name", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
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
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      async profile(profile) {
        return {
          id: profile.id,
          name: profile.display_name,
          email: profile.email,
          image: "",
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user || account) {
        if (
          account?.provider === "google" ||
          account?.provider === "facebook"
        ) {
          const { email, name, picture } = await authByClick({ profile } as {
            profile: any;
          });

          token = {
            ...token,
            email: email as string,
            name: name as string,
            picture: picture as string,
          };
        }
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
    redirect({ baseUrl }) {
      return `${baseUrl}/home`;
    },
  },
};
