import { z } from "zod"
import { createTRPCRouter, adminProcedure, dewaProcedure } from "../trpc"

export const sessionRouter = createTRPCRouter({
  // Queries - Admin Procedure
  getAllByEOIdAdminRole: adminProcedure.query(async ({ ctx }) => {
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
