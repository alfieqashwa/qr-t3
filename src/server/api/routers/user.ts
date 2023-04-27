import { createTRPCRouter, protectedProcedure } from "../trpc"

export const userRouter = createTRPCRouter({
  me: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      })
    }),
  updateRole: protectedProcedure
    .mutation(async ({ ctx }) => {
      return await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          role: "ADMIN"
        }
      })
    }),

  getEOByUserId: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        include: { eventOrganizer: true }
      })
    }),
  userRole: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { role: true }
      })
    }),
})
