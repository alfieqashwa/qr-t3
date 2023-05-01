import { z } from "zod"
import { adminAndDewaOnlyProcedure, createTRPCRouter, protectedProcedure } from "../trpc"
import { Role } from "@prisma/client"

export const userRouter = createTRPCRouter({
  me: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      })
    }),
  updateRole: protectedProcedure
    .input(z.object({ role: z.nativeEnum(Role) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          role: input.role
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

  create: adminAndDewaOnlyProcedure
    .input(z.object({
      name: z.string(),
      email: z.string().email(),
      emailVerified: z.string().email(),
      image: z.string().nullable(),
      role: z.nativeEnum(Role),
      eventOrganizerId: z.string().cuid()
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          emailVerified: input.emailVerified,
          image: input.image,
          role: input.role,
          eventOrganizerId: input.eventOrganizerId
        }
      })
    }),
  getAll: adminAndDewaOnlyProcedure
    .query(({ ctx }) => {
      return ctx.prisma.user.findMany()
    })
})
