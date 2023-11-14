import { Status } from "@prisma/client"
import { z } from "zod"
import { generateSeatSchema, generateTicketSchema } from "~/src/types/schema"
import {
  createTRPCRouter,
  editorProcedure,
  operatorProcedure,
  protectedProcedure,
  publicProcedure,
} from "../trpc"

export const ticketRouter = createTRPCRouter({
  // Queries - Public Procedure
  getAllByEventIdPublic: publicProcedure
    .input(z.object({ eventId: z.string().cuid() }))
    .query(async ({ ctx, input: { eventId } }) => {
      return await ctx.prisma.ticket.findMany({
        where: {
          eventId,
          status: "AVAILABLE",
        },
        include: { visitors: { select: { ticketId: true } } },
      })
    }),
  // Queries - Protected Procedure
  count: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.ticket.count()
  }),
  categories: protectedProcedure
    .input(z.object({ isProfit: z.boolean() }))
    .query(async ({ ctx, input: { isProfit } }) => {
      return await ctx.prisma.ticket.findMany({
        where: {
          eventOrganizerId: ctx.session.user.eventOrganizerId as string,
          event: { profit: isProfit },
        },
      })
    }),
  getAll: protectedProcedure
    .input(z.object({ isProfit: z.boolean() }))
    .query(async ({ ctx, input: { isProfit } }) => {
      return await ctx.prisma.ticket.findMany({
        where: {
          eventOrganizerId: ctx.session.user.eventOrganizerId as string,
          event: { profit: isProfit },
        },
        include: {
          event: {
            select: { title: true },
          },
        },
        orderBy: { event: { date: "asc" } },
      })
    }),
  getAllByEventId: protectedProcedure
    .input(z.object({ eventId: z.string().cuid() }))
    .query(async ({ ctx, input: { eventId } }) => {
      return await ctx.prisma.ticket.findMany({
        where: {
          eventId,
          eventOrganizerId: ctx.session.user.eventOrganizerId as string,
        },
        include: { visitors: { select: { ticketId: true } } },
      })
    }),

  // Queries - Operator Procedure
  getAllByIdOperatorRole: operatorProcedure
    .input(z.object({ ticketId: z.string().cuid() }))
    .query(async ({ ctx, input: { ticketId } }) => {
      return await ctx.prisma.ticket.findUnique({
        where: { id: ticketId },
        include: { visitors: true, event: true, eventOrganizer: true },
      })
    }),

  // Mutations - Editor Procedure
  generateTicketEditorRole: editorProcedure
    .input(generateTicketSchema)
    .mutation(async ({ ctx, input: { qty, price, category, eventId } }) => {
      const eventOrganizerId = ctx.session.user.eventOrganizerId as string
      function generateTickets() {
        return Array.from({ length: qty }, () => ({
          price,
          category,
          eventId,
          eventOrganizerId,
        }))
      }
      const generatedTickets = generateTickets()
      return await ctx.prisma.ticket.createMany({
        data: generatedTickets,
      })
    }),
  generateSeatEditorRole: editorProcedure
    .input(generateSeatSchema)
    .mutation(async ({ ctx, input: { qty, category, eventId } }) => {
      const eventOrganizerId = ctx.session.user.eventOrganizerId as string
      return await ctx.prisma.ticket.createMany({
        data: Array.from({ length: qty }, () => ({
          category,
          eventId,
          eventOrganizerId,
        })),
      })
    }),
  updateStatusEditorRole: editorProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        status: z.nativeEnum(Status),
      }),
    )
    .mutation(async ({ ctx, input: { id, status } }) => {
      return await ctx.prisma.ticket.update({
        where: { id },
        data: { status },
      })
    }),
  // Automatic change status to SOLD whenever the ticket get purchased by customer(s)
  soldEditorRole: editorProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.ticket.update({
        where: { id },
        data: {
          status: Status.SOLD,
        },
      })
    }),
  // Automatic change status to REFUND whenever the ticket get refund by customer(s)
  refundEditorRole: editorProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.ticket.update({
        where: { id },
        data: {
          status: Status.REFUND,
        },
      })
    }),
  deleteEditorRole: editorProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.ticket.delete({ where: { id } })
    }),
  deleteSelected: editorProcedure
    .input(z.array(z.object({ id: z.string().cuid() })))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.ticket.deleteMany({
        where: {
          OR: input,
        },
      })
    }),
})
