import { z } from "zod"
import { createTRPCRouter, dewaProcedure } from "../trpc"

export const sessionRouter = createTRPCRouter({
  // Queries - Admin Procedure
  getAllByEOIdAdminRole: dewaProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.session.findMany()
  }),
  // Mutations - Dewa Procedure
  deleteDewaRole: dewaProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.session.delete({
        where: { id },
      })
    }),
})
