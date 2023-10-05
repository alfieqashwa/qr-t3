import { Role } from "@prisma/client"
import { z } from "zod"
import { createTeamSchema, updateTeamSchema } from "~/src/types/schema"
import {
  adminProcedure,
  createTRPCRouter,
  dewaProcedure,
  protectedProcedure,
} from "../trpc"

export const userRouter = createTRPCRouter({
  // Queries - Protected Procedure
  me: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    })
  }),

  // Queries - Admin Procedure
  getAllByEOIdAdminRole: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
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
  getRoleAdminRole: adminProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      select: { role: true },
    })
  }),

  // Queries - Dewa Procedure
  getAllUsers: dewaProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      include: { eventOrganizer: { select: { name: true } } },
    })
  }),

  // Mutations - Protected Procedure
  removeImageUpdate: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.user.update({
      where: { id: ctx.session.user.id },
      data: { imageUpdate: null },
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
  deleteMe: protectedProcedure // if user sign out before submit create-eo form -> so, it should be protected procedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.user.delete({
        where: { id },
      })
    }),

  // Mutations - Admin Procedure
  createAdminRole: adminProcedure
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
  updateRoleAdminRole: adminProcedure
    .input(z.object({ role: z.nativeEnum(Role) }))
    .mutation(async ({ ctx, input: { role } }) => {
      return await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          role,
        },
      })
    }),
  updateTeamAdminRole: adminProcedure
    .input(updateTeamSchema)
    .mutation(async ({ ctx, input: { id, role } }) => {
      return await ctx.prisma.user.update({
        where: { id },
        data: { role, eventOrganizerId: ctx.session.user.eventOrganizerId },
      })
    }),
  deleteAdminRole: adminProcedure // --> only dewa or admin can access this.
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.user.delete({
        where: { id },
      })
    }),
})
