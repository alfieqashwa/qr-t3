import { PrismaAdapter } from "@next-auth/prisma-adapter"
import type { Role } from "@prisma/client"
import type { GetServerSidePropsContext } from "next"
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { env } from "../env/server.mjs"
import { prisma } from "./db"

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      // ...other properties
      role: Role
      eventOrganizerId?: string | null
    } & DefaultSession["user"]
  }

  interface User {
    // ...other properties
    role: Role
    eventOrganizerId?: string | null
  }
}

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  callbacks: {
    // configure registeredUser created by ADMIN
    async signIn({ account, user }) {
      const email = user?.email as string
      const registeredUser = await prisma.user.findUnique({
        where: { email }
      })

      if (!user.eventOrganizerId && !!registeredUser) {
        await prisma.user.update({
          where: { id: registeredUser.id },
          data: {
            name: user.name,
            image: user.image,
            role: registeredUser.role,
            eventOrganizerId: registeredUser.eventOrganizerId,
            accounts: {
              create: {
                provider: account?.provider as string,
                type: account?.type as string,
                providerAccountId: account?.providerAccountId as string,
                access_token: account?.access_token,
                expires_at: account?.expires_at,
                scope: account?.scope,
                token_type: account?.token_type,
                id_token: account?.id_token,
              }
            }
          }
        })
      }
      return true
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        // <-- put other properties on the session here
        session.user.role = user.role
        session.user.eventOrganizerId = user.eventOrganizerId ?? null
      }
      return session
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     **/
  ],
}

/**
 * Wrapper for getServerSession so that you don't need
 * to import the authOptions in every file.
 * @see https://next-auth.js.org/configuration/nextjs
 **/
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"]
  res: GetServerSidePropsContext["res"]
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions)
}
