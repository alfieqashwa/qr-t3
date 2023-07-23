import { createVisitorSchema } from "~/src/types/schema"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const visitorRouter = createTRPCRouter({
  // Queries
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.visitor.findMany({
      where: { eventOrganizerId: ctx.session.user.eventOrganizerId as string },
      include: { event: true, ticket: true },
      orderBy: { updatedAt: "asc" },
    })
  }),
  isCheckIn: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.visitor.findMany({
      where: { eventOrganizerId: ctx.session.user.eventOrganizerId as string },
      select: { isCheckIn: true }
    })
  }),

  // Mutations
  create: protectedProcedure
    .input(createVisitorSchema)
    .mutation(async ({ ctx, input: { name, phone, email, eventId, ticketId } }) => {
      return await ctx.prisma.visitor.create({
        data: {
          name,
          phone,
          email,
          eventOrganizerId: ctx.session.user.eventOrganizerId as string,
          eventId,
          ticketId
        }
      })
    })
})