import { z } from "zod"
import { adminProcedure, createTRPCRouter, editorProcedure, protectedProcedure } from "../trpc"
import { Status } from "@prisma/client"

export const ticketRouter = createTRPCRouter({
  count: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.ticket.count()
  }),
  deleteAll: adminProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.ticket.deleteMany()
  }),
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.ticket.findMany({
        where: { eventOrganizerId: ctx.session.user.eventOrganizerId as string },
        include: {
          event: true,
        },
        orderBy: { event: { date: "asc" } },
      })
    }),
  generate: adminProcedure
    .input(z.object({
      eventId: z.string({
        required_error: "Event is required",
        invalid_type_error: "Event must be a string",
      }).cuid(),
      category: z.string({
        required_error: "Category is required",
        invalid_type_error: "Category must be a string",
      }).min(3).max(15),
      price: z.number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a number",
      }).int().gt(0),
      qty: z.number({
        required_error: "Qty is required",
        invalid_type_error: "Qty must be a number",
      }).int().gte(10),
    }))
    .mutation(async ({ ctx, input: { eventId, category, price, qty } }) => {
      try {
        function generateTickets() {
          return Array.from({ length: qty }, () => ({
            price,
            category,
            eventId,
            eventOrganizerId: ctx.session.user.eventOrganizerId as string,
          }))
        }
        const generatedTickets = generateTickets()
        return await ctx.prisma.ticket.createMany({
          data: generatedTickets
        })
      } catch (err) {
        console.error(err)
      }
    }),
  update: editorProcedure
    .input(z.object({
      id: z.string({
        required_error: "ID is required",
        invalid_type_error: "ID must be a string",
      }).cuid(),
      category: z.string({
        required_error: "Category is required",
        invalid_type_error: "Category must be a string",
      }),
      price: z.number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a number",
      }).int().gte(10),
    }))
    .mutation(async ({ ctx, input: { id, category, price } }) => {
      return await ctx.prisma.ticket.update({
        where: { id },
        data: {
          category,
          price,
        },
      })
    }),
  delete: adminProcedure.input(z.object({
    id: z.string().cuid(),
  })).mutation(async ({ ctx, input: { id } }) => {
    try {
      await ctx.prisma.ticket.delete({ where: { id } })
    } catch (err) {
      console.error(err)
    }
  })
})