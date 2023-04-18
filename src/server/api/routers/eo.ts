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
        address: z.object({
          street: z.string(),
          city: z.string(),
          postalCode: z.string()
        }),
        phone: z.string(),
        userId: z.string().cuid()
      })
    ).mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.eventOrganizer.create({
          data: {
            name: input.name,
            address: {
              create: {
                street: input.address.street,
                city: input.address.city,
                postalCode: input.address.postalCode
              }
            },
            phone: input.phone,
            users: {
              create: {
                id: input.userId
              }
            },
          }
        })
      } catch (err) {
        console.error(err)
      }
    }),
})
