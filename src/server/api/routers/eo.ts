import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const eoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string({
          required_error: "Name is required",
          invalid_type_error: "Name must be a string",
        }).min(3).max(25),
        phone: z.string({
          required_error: "Phone is required",
          invalid_type_error: "Phone must be a string",
        }).min(7).max(12),
        province: z.string(),
        regency: z.string(),
        district: z.string(),
        village: z.string(),
        street: z.string({
          required_error: "Required",
          invalid_type_error: "Must be a string"
        }).min(10),
        postalCode: z.string({
          required_error: "Required",
          invalid_type_error: "Must be a string"
        }).length(5)
      }).required()
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