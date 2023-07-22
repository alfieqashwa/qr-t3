import { createTRPCRouter, protectedProcedure } from "../trpc"

export const visitorRouter = createTRPCRouter({
  // Queries
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.visitor.findMany({
      where: { eventOrganizerId: ctx.session.user.eventOrganizerId as string },
      orderBy: { updatedAt: "asc" },
    })
  }),
  isCheckIn: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.visitor.findMany({
      where: { eventOrganizerId: ctx.session.user.eventOrganizerId as string },
      select: { isCheckIn: true }
    })
  })
})