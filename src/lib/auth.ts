import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./db";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

interface User {
  id: string;
  username: string;
  role: string;
  profile: string;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const existingUser = await prisma.user.findFirst({
          where: { username: credentials.username },
        });

        if (!existingUser) {
          return null;
        }

        const passwordMatch = await compare(
          credentials.password,
          existingUser.password
        );

        if (!passwordMatch) {
          return null;
        }

        const user: User = {
          id: existingUser.id,
          username: existingUser.username,
          role: existingUser.role,
          profile: existingUser.profile || "", // Ensure profile is always a string
        };

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.provider == "credentials") {
        if (user) {
          token.id = user.id;
          token.username = user.username;
          token.role = user.role;
          token.profile = user.profile;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if ("id" in token) {
        session.user.id = token.id as string;
      }
      if ("username" in token) {
        session.user.username = token.username as string;
      }
      if ("role" in token) {
        session.user.role = token.role as string;
      }
      if ("profile" in token) {
        session.user.profile = token.profile as string;
      }

      const accessToken = jwt.sign(token, process.env.NEXTAUTH_SECRET || "", {
        algorithm: "HS256",
      });

      session.accessToken = accessToken;

      return session;
    },
  },
};
