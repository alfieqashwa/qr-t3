import { z } from "zod"
import { createTRPCRouter, dewaProcedure } from "../trpc"

export const sessionRouter = createTRPCRouter({
  // Queries - Dewa Procedure

  // Mutations - Dewa Procedure
  delete: dewaProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.session.delete({
        where: { id },
      })
    }),
})
