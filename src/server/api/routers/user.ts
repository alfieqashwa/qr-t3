import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const userRouter = createTRPCRouter({
  me: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx }) => {
      return ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      })
    }),
  getEOIdByUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx }) => {
      return ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { eventOrganizerId: true, }
      })
    })
})
