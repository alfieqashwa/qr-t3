import { z } from "zod";
import { createEventSchema, updateEventSchema } from "~/types/schema";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

export const eventRouter = createTRPCRouter({
  // Queries
  count: protectedProcedure.query(
    async ({ ctx }) => await ctx.prisma.event.count()
  ),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.event.findMany({
      where: { eventOrganizerId: ctx.session.user.eventOrganizerId as string },
      orderBy: { date: "asc" },
    });
  }),
  getById: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.event.findUnique({
        where: { id },
      });
    }),
  eventData: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.event.findMany({
      where: { eventOrganizerId: ctx.session.user.eventOrganizerId as string },
      select: { title: true, venue: true },
    });
  }),
  // Mutations
  create: adminProcedure
    .input(createEventSchema)
    .mutation(async ({ ctx, input: { title, venue, date } }) => {
      try {
        return await ctx.prisma.event.create({
          data: {
            title,
            venue,
            date,
            eventOrganizerId: ctx.session.user.eventOrganizerId as string,
          },
        });
      } catch (err) {
        console.error(err);
      }
    }),
  update: adminProcedure
    .input(updateEventSchema)
    .mutation(async ({ ctx, input: { id, title, venue, date } }) => {
      try {
        return await ctx.prisma.event.update({
          where: { id },
          data: { title, venue, date },
        });
      } catch (err) {
        console.error(err);
      }
    }),
  delete: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      try {
        return await ctx.prisma.event.delete({ where: { id } });
      } catch (err) {
        console.error(err);
      }
    }),
  deleteSelected: adminProcedure
    .input(z.array(z.object({ id: z.string().cuid() })))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.event.deleteMany({
        where: {
          OR: input,
        },
      });
    }),
});
