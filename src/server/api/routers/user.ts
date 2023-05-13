import { Role } from "@prisma/client"
import { z } from "zod"
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc"

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
  create: adminProcedure
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
  getAllByEOId: adminProcedure
    .query(({ ctx }) => {
      return ctx.prisma.user.findMany({
        where: {
          eventOrganizerId: ctx.session.user.eventOrganizerId,
          OR: [
            { role: { equals: Role.EDITOR } },
            { role: { equals: Role.OPERATOR } },
          ]
        },
        orderBy: { name: "asc" }, // A -> Z
        include: { eventOrganizer: { select: { name: true } } } // include EO but only select the name of EO
      })
    }),
  updateTeam: adminProcedure
    .input(z.object({
      id: z.string().cuid(),
      role: z.nativeEnum(Role),
    }))
    .mutation(async ({ ctx, input: { id, role } }) => {
      try {
        return await ctx.prisma.user.update({
          where: { id },
          data: { role, eventOrganizerId: ctx.session.user.eventOrganizerId }
        })
      } catch (err) {
        console.error(err)
      }
    }),
  delete: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.user.delete({
          where: { id: input.id }
        })
      } catch (err) {
        console.error(err)
      }
    }),
  updateImageProfile: adminProcedure
    .input(z.object({ imageUpdate: z.string().url() }))
    .mutation(async ({ ctx, input: { imageUpdate } }) => {
      try {
        return await ctx.prisma.user.update({
          where: { id: ctx.session.user.id },
          data: {
            imageUpdate
          }
        })
      } catch (err) {
        console.error(err)
      }
    })
})
