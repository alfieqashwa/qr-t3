import { Status } from "@prisma/client"
import { z } from "zod"
import { generateTicketSchema } from "~/src/types/schema"
import {
  createTRPCRouter,
  editorProcedure,
  operatorProcedure,
  protectedProcedure,
  publicProcedure,
} from "../trpc"

export const ticketRouter = createTRPCRouter({
  // Queries - Public Procedure
  getAllByCategoryIdPublic: publicProcedure
    .input(z.object({ categoryId: z.string().cuid() }))
    .query(async ({ ctx, input: { categoryId } }) => {
      return await ctx.prisma.ticket.findMany({
        where: {
          categoryId,
          status: "AVAILABLE",
        },
        include: { category: true },
      })
    }),
  // Queries - Protected Procedure
  count: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.ticket.count()
  }),
  getAll: protectedProcedure
    .input(z.object({ isProfit: z.boolean() }))
    .query(async ({ ctx, input: { isProfit } }) => {
      return await ctx.prisma.ticket.findMany({
        where: {
          event: { profit: isProfit },
        },
        include: {
          event: { select: { title: true } },
          category: { select: { name: true, price: true } },
          visitor: { select: { name: true, email: true } },
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
        },
        orderBy: { id: "asc" },
      })
    }),
  getAllByCategoryId: protectedProcedure
    .input(z.object({ categoryId: z.string().cuid() }))
    .query(async ({ ctx, input: { categoryId } }) => {
      return await ctx.prisma.ticket.findMany({
        where: { categoryId },
        include: { category: { select: { name: true } } },
      })
    }),

  // Queries - Operator Procedure
  getAllByIdOperatorRole: operatorProcedure
    .input(z.object({ ticketId: z.string().cuid() }))
    .query(async ({ ctx, input: { ticketId } }) => {
      return await ctx.prisma.ticket.findUnique({
        where: { id: ticketId },
        include: {
          visitor: true,
          event: {
            include: {
              eventOrganizer: { select: { name: true } },
            },
          },
        },
      })
    }),

  // Mutations - Editor Procedure
  generateTicketEditorRole: editorProcedure
    .input(generateTicketSchema)
    .mutation(async ({ ctx, input: { qty, categoryId, eventId } }) => {
      return await ctx.prisma.ticket.createMany({
        data: Array.from({ length: qty }, () => ({
          categoryId,
          eventId,
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
  // Automatic change status to BOOKED whenever the ticket have already beend booked by customer(s)
  soldEditorRole: editorProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.ticket.update({
        where: { id },
        data: {
          status: Status.BOOKED,
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
