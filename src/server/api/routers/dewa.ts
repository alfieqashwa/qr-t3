import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "../trpc"

export const dewaRouter = createTRPCRouter({
  // Queries
  getAll: publicProcedure.query(async ({ ctx }) => {
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
  deleteEo: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.eventOrganizer.delete({
        where: { id },
      })
    }),

  deleteAll: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.eventOrganizer.deleteMany()
  }),
})
