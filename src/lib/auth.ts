import { env } from "@/env.mjs";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Session } from "next-auth/types";
import { z } from "zod";

async function login(body: {
  email: string;
  password: string;
}): Promise<Session["user"] | undefined> {
  const api = `${env.CIS_API}/login`;
  try {
    const res = await fetch(api, {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data?.code === 200 && data?.result?.user) {
      const user = data.result.user;
      return {
        ...user,
        image: user.profile_photo_url,
        id: String(user.id),
        accessToken: data.result.token,
      };
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
}

export async function getUser() {
  const session = await auth();
  if (!session?.user) throw new Error("No user!");
  return session.user;
}

export const authConfig = {
  pages: {
    signIn: "/signin",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized: ({ auth, request }) => {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      const isTryingAuthenticated = pathname !== "/signin";
      if (isTryingAuthenticated) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      if (isLoggedIn) {
        return Response.redirect(new URL("/fims", request.nextUrl));
      }

      return false;
    },
    session: ({ session, token }) => {
      const id = token?.id as string;
      return {
        ...session,
        user: {
          ...session.user,
          id,
        },
      };
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token = {
          ...token,
          ...user,
        };
      }
      return token;
    },
  },
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      authorize: async (credentials) => {
        if (!credentials) {
          console.error("For some reason credentials are missing");
          throw new Error("Internal Server Error.");
        }
        const parse = z
          .object({
            email: z.string().email(),
            password: z.string().min(6, {
              message: "Password must contain at least 6 character(s)",
            }),
          })
          .safeParse(credentials);

        if (!parse.success) throw new Error(parse.error.issues[0].message);

        const user = await login(parse.data);
        if (!user) throw new Error("Invalid Credentials!");
        return {
          ...user,
          id: String(user.id),
        };
      },
    }),
  ],
});
