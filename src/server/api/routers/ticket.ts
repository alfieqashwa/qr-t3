import { z } from "zod"
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc"
import { TASKS } from "~/src/components/table-list/data/tasks"
import { customAlphabet } from "nanoid/async"

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
        const event = await ctx.prisma.event.findUnique({
          where: { id: eventId },
          select: { title: true },
        })
        const eventOrganizerId = ctx.session.user.eventOrganizerId as string
        const eventOrganizer = await ctx.prisma.eventOrganizer.findUnique({
          where: { id: eventOrganizerId },
          select: { name: true }
        })

        // radiohead kid a became rka
        function abbreviationWords(words: string): string | undefined {
          if (words == null || typeof words !== "string") return
          return words.split(" ").map((word) => word.charAt(0)).join("")
        }
        const _sku = abbreviationWords(event?.title as string) as string
        const _eoName = abbreviationWords(eventOrganizer?.name as string) as string

        const randomTitle = event?.title && event.title.replace(/\s+/g, '') //remove all whitespaces
        const nanoid = customAlphabet(randomTitle as string, 4) // generate 4 characters based on its event's title
        const randomTicketSubtitle = await nanoid()

        if (typeof _sku !== "string" && typeof _eoName !== "string") {
          throw new Error()
        }
        function generateTickets() {
          return Array.from({ length: qty }, () => ({
            price,
            category,
            eventId,
            eventOrganizerId,
            sku: `${_eoName}-${_sku}-${randomTicketSubtitle}`
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