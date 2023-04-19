import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const eoRouter = createTRPCRouter({
  getEOId: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.user.findUnique({
        where: { id: input },
        select: { eventOrganizerId: true, }
      })
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        phone: z.string(),
        street: z.string(),
        city: z.string(),
        postalCode: z.string()
      })
    ).mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.eventOrganizer.create({
          data: {
            name: input.name,
            phone: input.phone,
            street: input.street,
            city: input.city,
            postalCode: input.postalCode,
            users: {
              create: {
                id: ctx.session.user.id
              }
            }
          }
        })
      } catch (err) {
        console.error(err)
      }
    }),
})