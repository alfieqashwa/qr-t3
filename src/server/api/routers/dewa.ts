import { z } from "zod"
import { createTRPCRouter, dewaProcedure } from "../trpc"

export const dewaRouter = createTRPCRouter({
  // Queries
  getAll: dewaProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.eventOrganizer.findMany({
      include: {
        events: true,
        users: {
          include: {
            accounts: true,
            sessions: true,
          },
        },
        tickets: true,
        visitors: true,
        _count: true,
      },
    })
  }),
  getAllAccount: dewaProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.account.findMany({
      include: { user: true },
    })
  }),

  // Mutations
  deleteAccount: dewaProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.account.delete({
        where: { id },
      })
    }),
  deleteSession: dewaProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.session.delete({
        where: { id },
      })
    }),

  deleteAll: dewaProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.eventOrganizer.deleteMany()
  }),
})
