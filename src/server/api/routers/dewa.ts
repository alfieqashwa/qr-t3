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
  deleteAll: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.eventOrganizer.deleteMany()
  }),
})
