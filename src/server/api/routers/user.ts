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
      name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      }).min(3).max(25),
      email: z.string().email(),
      image: z.string().url().optional(),
      role: z.nativeEnum(Role),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.user.create({
          data: {
            name: input.name,
            email: input.email,
            image: input.image,
            role: input.role,
            eventOrganizerId: ctx.session.user.eventOrganizerId
          }
        })
      } catch (err) {
        console.error(err)
      }
    }),
  getAll: adminAndDewaOnlyProcedure
    .query(({ ctx }) => {
      return ctx.prisma.user.findMany({
        // exclude "DEWA" & "ADMIN" user
        where: { role: "EDITOR" || "OPERATOR" },
      })
    }),
  delete: adminAndDewaOnlyProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.user.delete({
          where: { id: input.id }
        })
      } catch (err) {
        console.error(err)
      }
    })
})
