import { z } from "zod"
import { createVisitorSchema, updateVisitorSchema } from "~/src/types/schema"
import { createTRPCRouter, editorProcedure, protectedProcedure } from "../trpc"

export const visitorRouter = createTRPCRouter({
  // Queries
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.visitor.findMany({
      where: { eventOrganizerId: ctx.session.user.eventOrganizerId as string },
      include: { event: true, ticket: true },
      orderBy: { updatedAt: "asc" },
    })
  }),
  getById: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.visitor.findUnique({
        where: { id }
      })
    }),
  isCheckIn: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.visitor.findMany({
      where: { eventOrganizerId: ctx.session.user.eventOrganizerId as string },
      select: { isCheckIn: true }
    })
  }),

  // Mutations
  create: editorProcedure
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
    }),
  update: editorProcedure
    .input(updateVisitorSchema)
    .mutation(async ({ ctx, input: { id, name, phone, email } }) => {
      return await ctx.prisma.visitor.update({
        where: { id },
        data: {
          name,
          phone,
          email
        }
      })
    }),
  delete: editorProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.visitor.delete({
        where: { id }
      })
    })
})