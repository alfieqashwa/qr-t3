import { z } from "zod"
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc"

export const ticketRouter = createTRPCRouter({
  // Queries
  count: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.ticket.count()
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

  // Mutations
  generate: adminProcedure
    .input(z.object({
      qty: z.number({
        required_error: "Qty is required",
        invalid_type_error: "Qty must be a number",
      }
      ).int().gte(10),
      price: z.number({
        required_error: "Price is required",
        invalid_type_error: "Price must be a number",
      }
      ).int().gt(0),
      category: z.string({
        required_error: "Category is required",
        invalid_type_error: "Category must be a string",
      }).min(3).max(15),
      eventId: z.string({
        required_error: "EventId is required",
        invalid_type_error: "EventId must be a string",

      }).cuid()
    }))
    .mutation(async ({ ctx, input: { qty, price, category, eventId } }) => {
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
  deleteAll: adminProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.ticket.deleteMany()
  }),
})