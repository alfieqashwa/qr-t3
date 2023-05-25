import { z } from "zod"
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc"
import { TASKS } from "~/src/components/table-list/data/tasks"

export const ticketRouter = createTRPCRouter({
  // Queries
  tasks: protectedProcedure.query(() => {
    return TASKS
  }),
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
      eventId: z.string({
        required_error: "EventId is required",
        invalid_type_error: "EventId must be a string",
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
    .mutation(async ({ ctx, input: { qty, price, category, eventId } }) => {
      try {
        const eventOrganizerId = ctx.session.user.eventOrganizerId as string
        const event = await ctx.prisma.event.findUnique({
          where: { id: eventId },
          select: {
            title: true,
            venue: true,
            eventOrganizer: {
              select: { name: true }
            }
          },
        })

        // radiohead kid a -> rka
        function abbreviationWords(words: string): string {
          return words.split(" ").map((word) => word.charAt(0)).join("")
        }
        const eoName = abbreviationWords(event?.eventOrganizer.name as string)
        const eventName = abbreviationWords(event?.title as string)
        let venue = event?.venue as string
        venue = venue.length > 3 ? venue.substring(0, 3) : venue

        function generateTickets() {
          return Array.from({ length: qty }, () => ({
            price,
            category,
            eventId,
            eventOrganizerId,
            sku: `${eoName}-${eventName}-${venue}`
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