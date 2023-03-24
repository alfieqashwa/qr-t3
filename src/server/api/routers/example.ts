import { z } from "zod"

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc"

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello! ${input.text}`,
      }
    }),

  getUserByEmail: publicProcedure
    .input(z.string().email())
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: { email: input },
      })
    }),

  getAllUsers: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      include: { eventOrganizer: true },
    })
  }),
})
