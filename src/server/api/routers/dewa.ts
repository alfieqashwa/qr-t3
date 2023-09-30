import { z } from "zod"
import { createTRPCRouter, dewaProcedure, publicProcedure } from "../trpc"

export const dewaRouter = createTRPCRouter({
  // Queries
  getAll: dewaProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.eventOrganizer.findMany({
      include: {
        events: true,
        users: true,
        tickets: true,
        visitors: true,
        _count: true,
      },
    })
  }),
  // TEMPORARY
  deleteEo: dewaProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.eventOrganizer.delete({
        where: { id },
      })
    }),

  deleteAll: dewaProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.eventOrganizer.deleteMany()
  }),
})
