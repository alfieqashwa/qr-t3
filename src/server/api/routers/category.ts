import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "../trpc"

export const categoryRouter = createTRPCRouter({
  // Queries - Public Procedure
  getByIdPublic: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.category.findFirst({
        where: { id },
      })
    }),
})
