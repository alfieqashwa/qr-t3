import { z } from "zod"
import {
  createEventOrganizerSchema,
  updateEventOrganizerSchema,
} from "~/src/types/schema"
import {
  adminProcedure,
  createTRPCRouter,
  dewaProcedure,
  protectedProcedure,
} from "../trpc"

export const eoRouter = createTRPCRouter({
  // Queries - Protected Procedure
  nameBySessionId: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.eventOrganizer.findUnique({
        where: { id },
        select: { name: true },
      })
    }),
  read: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.eventOrganizer.findFirst({
      where: { users: { some: { id: ctx.session.user.id } } },
    })
  }),

  // Queries - Dewa Procedure
  getAllDewaRole: dewaProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.eventOrganizer.findMany({
      select: { id: true, name: true },
    })
  }),

  // Mutations - Protected Procedure
  create: protectedProcedure
    .input(createEventOrganizerSchema)
    .mutation(
      async ({
        ctx,
        input: {
          name,
          phone,
          province,
          regency,
          district,
          village,
          street,
          postalCode,
        },
      }) => {
        await ctx.prisma.eventOrganizer.create({
          data: {
            name,
            phone,
            province,
            regency,
            district,
            village,
            street,
            postalCode,
            users: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        })
      }
    ),

  // Mutations - Admin Procedure
  updateAdminRole: adminProcedure
    .input(updateEventOrganizerSchema)
    .mutation(
      async ({
        ctx,
        input: {
          id,
          name,
          phone,
          province,
          regency,
          district,
          village,
          street,
          postalCode,
        },
      }) => {
        await ctx.prisma.eventOrganizer.update({
          where: { id },
          data: {
            name,
            phone,
            province,
            regency,
            district,
            village,
            street,
            postalCode,
            users: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        })
      }
    ),
  deleteAdminRole: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      try {
        await ctx.prisma.eventOrganizer.delete({ where: { id } })
      } catch (err) {
        console.error(err)
      }
    }),

  // Mutations - Dewa Procedure
  deleteAllDewaRole: dewaProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.eventOrganizer.deleteMany()
  }),
})
