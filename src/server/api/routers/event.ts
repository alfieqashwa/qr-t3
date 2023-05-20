import { z } from "zod"
import { adminProcedure, createTRPCRouter, editorProcedure, protectedProcedure } from "../trpc"

export const eventRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.event.findMany({
      include: { tickets: true },
      orderBy: { date: "desc" }
    })
  }),
  create: adminProcedure
    .input(z.object({
      title: z.string().min(5).max(25),
      thumbnail: z.string().url(),
      location: z.string().min(5).max(25),
      date: z.date(),
      description: z.string().min(15).max(120),
      eventOrganizerId: z.string().cuid()
    }))
    .mutation(async ({ ctx, input: { title, thumbnail, location, date, description, eventOrganizerId } }) => {
      try {
        return await ctx.prisma.event.create({
          data: { title, thumbnail, location, date, description, eventOrganizerId }
        })
      } catch (err) {
        console.error(err)
      }
    }),
  update: editorProcedure
    .input(z.object({
      id: z.string().cuid(),
      title: z.string().min(5).max(25),
      thumbnail: z.string().url(),
      location: z.string().min(5).max(25),
      date: z.date(),
      description: z.string().min(15).max(120)
    }))
    .mutation(async ({ ctx, input: { id, title, thumbnail, location, date, description } }) => {
      try {
        return await ctx.prisma.event.update({
          where: { id },
          data: { title, thumbnail, location, date, description }
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