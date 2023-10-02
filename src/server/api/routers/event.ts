import { z } from "zod"
import { createEventSchema, updateEventSchema } from "~/types/schema"
import {
  adminProcedure,
  createTRPCRouter,
  editorProcedure,
  protectedProcedure,
} from "../trpc"

export const eventRouter = createTRPCRouter({
  // Queries - Protected Procedure
  count: protectedProcedure.query(
    async ({ ctx }) => await ctx.prisma.event.count()
  ),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.event.findMany({
      where: { eventOrganizerId: ctx.session.user.eventOrganizerId as string },
      orderBy: { date: "asc" },
    })
  }),
  eventData: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.event.findMany({
      where: { eventOrganizerId: ctx.session.user.eventOrganizerId as string },
      select: { title: true, venue: true },
    })
  }),

  // Queries - Editor Procedure
  getAllEditorRole: editorProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.event.findMany({
      where: { eventOrganizerId: ctx.session.user.eventOrganizerId as string },
      orderBy: { date: "asc" },
      include: {
        tickets: true,
        visitors: { include: { ticket: true } },
      },
    })
  }),

  // Queries - Admin Procedure
  getById: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.event.findUnique({
        where: { id },
      })
    }),

  // Mutations - Admin Procedure
  create: adminProcedure
    .input(createEventSchema)
    .mutation(async ({ ctx, input: { title, venue, date } }) => {
      return await ctx.prisma.event.create({
        data: {
          title,
          venue,
          date,
          eventOrganizerId: ctx.session.user.eventOrganizerId as string,
        },
      })
    }),
  update: adminProcedure
    .input(updateEventSchema)
    .mutation(async ({ ctx, input: { id, title, venue, date } }) => {
      return await ctx.prisma.event.update({
        where: { id },
        data: { title, venue, date },
      })
    }),
  delete: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.event.delete({ where: { id } })
    }),
  deleteSelected: adminProcedure
    .input(z.array(z.object({ id: z.string().cuid() })))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.event.deleteMany({
        where: {
          OR: input,
        },
      })
    }),
})
