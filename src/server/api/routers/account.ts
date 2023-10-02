import { z } from "zod"
import { createTRPCRouter, dewaProcedure } from "../trpc"

export const accountRouter = createTRPCRouter({
  // Queries - Dewa Procedure
  getAllDewaRole: dewaProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.account.findMany({
      include: { user: true },
    })
  }),

  // Mutations - Dewa Procedure
  deleteDewaRole: dewaProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.account.delete({
        where: { id },
      })
    }),
})
