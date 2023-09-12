import { adminProcedure, createTRPCRouter } from "../trpc"

export const dashboardRouter = createTRPCRouter({
  // Queries
  getAll: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.event.findMany({
      where: { eventOrganizerId: ctx.session.user.eventOrganizerId as string },
      orderBy: { date: "asc" },
      include: {
        visitors: true,
        tickets: true,
        _count: true
      }
    })
  }),
})