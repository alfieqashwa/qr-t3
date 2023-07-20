import { createTRPCRouter, protectedProcedure } from "../trpc"

export const visitorRouter = createTRPCRouter({
  // Queries
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.visitor.findMany({
      where: { eventOrganizerId: ctx.session.user.eventOrganizerId as string },
      include: { events: true, tickets: true },
      orderBy: { updatedAt: "asc" },
    })
  })
})