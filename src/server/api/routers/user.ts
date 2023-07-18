import { Role } from "@prisma/client"
import { z } from "zod"
import { createTeamSchema } from "~/src/types/schema"
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc"

export const userRouter = createTRPCRouter({
  // Queries
  me: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    })
  }),
  getAllByEOId: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany({
      where: {
        eventOrganizerId: ctx.session.user.eventOrganizerId,
        OR: [
          { role: { equals: Role.EDITOR } },
          { role: { equals: Role.OPERATOR } },
        ],
      },
      orderBy: { name: "asc" }, // A -> Z
      include: { eventOrganizer: { select: { name: true } } }, // include EO but only select the name of EO
    })
  }),
  getRole: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      select: { role: true },
    })
  }),

  // Mutations
  removeImageUpdate: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { imageUpdate: null },
    })
  }),
  updateRole: protectedProcedure
    .input(z.object({ role: z.nativeEnum(Role) }))
    .mutation(async ({ ctx, input: { role } }) => {
      return await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          role,
        },
      })
    }),
  create: adminProcedure
    .input(createTeamSchema)
    .mutation(async ({ ctx, input: { email, role } }) => {
      return await ctx.prisma.user.create({
        data: {
          email,
          role,
          eventOrganizerId: ctx.session.user.eventOrganizerId,
        },
      })
    }),
  updateTeam: adminProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        role: z.nativeEnum(Role),
      })
    )
    .mutation(async ({ ctx, input: { id, role } }) => {
      return await ctx.prisma.user.update({
        where: { id },
        data: { role, eventOrganizerId: ctx.session.user.eventOrganizerId },
      })
    }),
  delete: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.user.delete({
        where: { id },
      })
    }),
  updateImageProfile: protectedProcedure
    .input(z.object({ imageUpdate: z.string().url() }))
    .mutation(async ({ ctx, input: { imageUpdate } }) => {
      return await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          imageUpdate,
        },
      })
    }),
  deleteMe: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.user.delete({
        where: { id },
      })
    }),
})
