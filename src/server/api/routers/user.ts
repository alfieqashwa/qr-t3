import { Role } from "@prisma/client"
import { z } from "zod"
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc"

export const userRouter = createTRPCRouter({
  // Queries
  me: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      })
    }),
  getAllByEOId: adminProcedure
    .query(async ({ ctx }) => {
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
  getRole: adminProcedure.
    query(async ({ ctx }) => {
      return await ctx.prisma.user.findMany({
        select: { role: true }
      })
    }),

  // Mutations
  updateRole: protectedProcedure
    .input(z.object({ role: z.nativeEnum(Role) }))
    .mutation(async ({ ctx, input: { role } }) => {
      return await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          role
        }
      })
    }),
  create: adminProcedure
    .input(z.object({
      email: z.string().email(),
      image: z.string().url().optional(),
      role: z.nativeEnum(Role),
    }))
    .mutation(async ({ ctx, input: { email, image, role } }) => {
      try {
        return await ctx.prisma.user.create({
          data: {
            email,
            image,
            role,
            eventOrganizerId: ctx.session.user.eventOrganizerId,
          }
        })
      } catch (err) {
        console.error(err)
      }
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
    .mutation(async ({ ctx, input: { id } }) => {
      try {
        return await ctx.prisma.user.delete({
          where: { id }
        })
      } catch (err) {
        console.error(err)
      }
    }),
  updateImageProfile: protectedProcedure
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
    }),
  deleteMe: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      try {
        return await ctx.prisma.user.delete({
          where: { id },
        })
      } catch (err) {
        console.error(err)
      }
    })
})
