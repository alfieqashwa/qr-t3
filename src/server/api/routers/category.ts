import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"

export const categoryRouter = createTRPCRouter({
  // Queries - Public Procedure
  getByIdPublic: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.category.findFirst({
        where: { id },
      })
    }),
  getAllByEventId: protectedProcedure
    .input(z.object({ eventId: z.string().cuid() }))
    .query(async ({ ctx, input: { eventId } }) => {
      return await ctx.prisma.category.findMany({
        where: { eventId },
      })
    }),
  options: protectedProcedure
    .input(z.object({ isProfit: z.boolean().optional() }))
    .query(async ({ ctx, input: { isProfit } }) => {
      return await ctx.prisma.category.findMany({
        where: {
          event: { profit: isProfit },
        },
      })
    }),
})
