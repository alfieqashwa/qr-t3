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
        name: z.string({
          required_error: "Name is required",
          invalid_type_error: "Name must be a string",
        }).min(1).max(25),
        phone: z.string(),
        province: z.string(),
        regency: z.string(),
        district: z.string(),
        village: z.string(),
        street: z.string(),
        postalCode: z.string()
      })
    ).mutation(async ({ ctx, input: { name, phone, province, regency, district, village, street, postalCode } }) => {
      try {
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