import { createTRPCRouter, protectedProcedure } from "../trpc"

export const ticketRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.ticket.findMany({
      orderBy: { event: { date: "desc" } },
    })
  })
})