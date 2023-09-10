import { createTRPCRouter, dewaProcedure } from "../trpc"

export const dewaRouter = createTRPCRouter({
  // Queries
  getAll: dewaProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.eventOrganizer.findMany({
        include: {
          events: true,
          users: true,
          tickets: true,
          visitors: true,
          _count: true
        }
      })
    })
})