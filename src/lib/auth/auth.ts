import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../database/db";

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
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as User).id;
        token.username = (user as User).username;
        token.role = (user as User).role;
        token.profile = (user as User).profile;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const user = session.user as {
          id: string;
          username: string;
          role: string;
          profile: string;
        };
        user.id = token.id as string;
        user.username = token.username as string;
        user.role = token.role as string;
        user.profile = token.profile as string;

        const accessToken = jwt.sign(token, process.env.NEXTAUTH_SECRET || "", {
          algorithm: "HS256",
        });

        (session as any).accessToken = accessToken;
      }

      return session;
    },
  },
};
