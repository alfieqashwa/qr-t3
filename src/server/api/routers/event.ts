import { z } from "zod"
import { adminProcedure, createTRPCRouter, editorProcedure, protectedProcedure } from "../trpc"

export const eventRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.event.findMany({
      where: { eventOrganizerId: ctx.session.user.eventOrganizerId as string },
      orderBy: { date: "asc" },
      include: { tickets: { orderBy: { updatedAt: "asc" } } }

    })
  }),
  create: adminProcedure
    .input(z.object({
      title: z.string().min(5).max(25),
      thumbnail: z.string().url(),
      venue: z.string().min(5).max(25),
      date: z.date(),
      eventOrganizerId: z.string().cuid()
    }))
    .mutation(async ({ ctx, input: { title, thumbnail, venue, date, eventOrganizerId } }) => {
      try {
        return await ctx.prisma.event.create({
          data: { title, thumbnail, venue, date, eventOrganizerId }
        })
      } catch (err) {
        console.error(err)
      }
    }),
  update: editorProcedure
    .input(z.object({
      id: z.string().cuid(),
      title: z.string().min(5).max(25),
      venue: z.string().min(5).max(25),
      date: z.date(),
    }))
    .mutation(async ({ ctx, input: { id, title, venue, date } }) => {
      try {
        return await ctx.prisma.event.update({
          where: { id },
          data: { title, venue, date }
        })
      } catch (err) {
        console.error(err)
      }
    }),
  delete: adminProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      try {
        return await ctx.prisma.event.delete({ where: { id } })
      } catch (err) {
        console.error(err)
      }
    })
})