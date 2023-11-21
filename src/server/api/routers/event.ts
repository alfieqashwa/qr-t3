import { z } from "zod"
import { createEventSchema, updateEventSchema } from "~/types/schema"
import {
  adminProcedure,
  createTRPCRouter,
  editorProcedure,
  protectedProcedure,
  publicProcedure,
} from "../trpc"

export const eventRouter = createTRPCRouter({
  // Queries - Public Procedure
  getByIdPublic: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.event.findUnique({
        where: { id },
        include: {
          categories: true,
          eventOrganizer: { select: { name: true } },
        },
      })
    }),
  // Queries - Public Procedure
  getAllByEventOrganizerIdPublic: publicProcedure
    .input(z.object({ eventOrganizerId: z.string().cuid() }))
    .query(async ({ ctx, input: { eventOrganizerId } }) => {
      return await ctx.prisma.event.findMany({
        where: { eventOrganizerId },
        orderBy: { date: "asc" },
      })
    }),

  // Queries - Protected Procedure
  count: protectedProcedure.input(z.object({ isProfit: z.boolean() })).query(
    async ({ ctx, input: { isProfit } }) =>
      await ctx.prisma.event.count({
        where: {
          eventOrganizerId: ctx.session.user.eventOrganizerId as string,
          profit: isProfit,
        },
      }),
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
      select: {
        title: true,
        venue: true,
        profit: true,
        tickets: { select: { category: true } },
      },
    })
  }),

  // Queries - Editor Procedure
  getAllEditorRole: editorProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.event.findMany({
      where: { eventOrganizerId: ctx.session.user.eventOrganizerId as string },
      orderBy: { date: "asc" },
      include: {
        tickets: { include: { visitor: true } },
      },
    })
  }),

  // Queries - Admin Procedure
  getByIdAdminRole: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.event.findUnique({
        where: { id },
        include: { tickets: true, categories: true },
      })
    }),

  // Mutations - Admin Procedure
  createAdminRole: adminProcedure
    .input(createEventSchema)
    .mutation(
      async ({ ctx, input: { title, venue, date, profit, categories } }) => {
        return await ctx.prisma.event.create({
          data: {
            title,
            venue,
            date,
            profit: profit as boolean,
            categories: {
              createMany: {
                data: categories,
              },
            },
            eventOrganizerId: ctx.session.user.eventOrganizerId as string,
          },
        })
      },
    ),
  updateAdminRole: adminProcedure
    .input(updateEventSchema)
    .mutation(
      async ({
        ctx,
        input: { id, title, venue, date, profit, categories },
      }) => {
        const updates = categories.map((c) => ({
          where: { id: c.id },
          data: { name: c.name, price: c.price },
        }))

        return await ctx.prisma.event.update({
          where: { id },
          data: {
            title,
            venue,
            date,
            profit,
            categories: {
              updateMany: updates,
            },
          },
        })
      },
    ),
  deleteAdminRole: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.event.delete({ where: { id } })
    }),
  deleteSelectedAdminRole: adminProcedure
    .input(z.array(z.object({ id: z.string().cuid() })))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.event.deleteMany({
        where: {
          OR: input,
        },
      })
    }),
})
