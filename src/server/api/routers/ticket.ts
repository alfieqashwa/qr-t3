import { Status } from "@prisma/client"
import { z } from "zod"
import { TASKS } from "~/components/table-list-sample/data/tasks"
import { createTRPCRouter, editorProcedure, protectedProcedure } from "../trpc"

export const ticketRouter = createTRPCRouter({
  // Queries
  tasks: protectedProcedure.query(() => {
    return TASKS
  }),
  count: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.ticket.count()
  }),
  categories: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.ticket.findMany({
        where: { eventOrganizerId: ctx.session.user.eventOrganizerId as string },
        select: { category: true },
      })
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.ticket.findMany({
      where: { eventOrganizerId: ctx.session.user.eventOrganizerId as string },
      include: {
        event: { select: { title: true } },
      },
      orderBy: { event: { date: "asc" } },
    })
  }),

  getAllByEventId: protectedProcedure
    .input((z.object({ eventId: z.string().cuid() })))
    .query(async ({ ctx, input: { eventId } }) => {
      return await ctx.prisma.ticket.findMany({
        where: { eventId }
      })
    }),

  // Mutations
  generate: editorProcedure
    .input(
      z.object({
        eventId: z
          .string({
            required_error: "EventId is required",
            invalid_type_error: "EventId must be a string",
          })
          .cuid(),
        category: z
          .string({
            required_error: "Category is required",
            invalid_type_error: "Category must be a string",
          })
          .min(3)
          .max(15),
        price: z
          .number({
            required_error: "Price is required",
            invalid_type_error: "Price must be a number",
          })
          .int()
          .gt(0),
        qty: z
          .number({
            required_error: "Qty is required",
            invalid_type_error: "Qty must be a number",
          })
          .int()
          .gte(10),
      })
    )
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
  updateStatus: editorProcedure
    .input(z.object({
      id: z.string().cuid(),
      status: z.nativeEnum(Status),
    }))
    .mutation(async ({ ctx, input: { id, status } }) => {
      return await ctx.prisma.ticket.update({
        where: { id },
        data: { status }
      })
    }),
  // Automatic change status to SOLD whenever the ticket get purchased by customer(s)
  sold: editorProcedure
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
  refund: editorProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.ticket.update({
        where: { id },
        data: {
          status: Status.REFUND,
        },
      })
    }),
  delete: editorProcedure
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
