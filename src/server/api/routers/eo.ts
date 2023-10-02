import { z } from "zod"
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
    .input(
      z
        .object({
          name: z
            .string({
              required_error: "Name is required",
              invalid_type_error: "Name must be a string",
            })
            .min(3)
            .max(25),
          phone: z
            .string({
              required_error: "Phone is required",
              invalid_type_error: "Phone must be a string",
            })
            .min(7)
            .max(12),
          province: z.string(),
          regency: z.string(),
          district: z.string(),
          village: z.string(),
          street: z
            .string({
              required_error: "Required",
              invalid_type_error: "Must be a string",
            })
            .min(10),
          postalCode: z
            .string({
              required_error: "Required",
              invalid_type_error: "Must be a string",
            })
            .length(5),
        })
        .required()
    )
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
  update: adminProcedure
    .input(
      z
        .object({
          id: z.string().cuid(),
          name: z
            .string({
              required_error: "Name is required",
              invalid_type_error: "Name must be a string",
            })
            .min(3)
            .max(25),
          phone: z
            .string({
              required_error: "Phone is required",
              invalid_type_error: "Phone must be a string",
            })
            .min(7)
            .max(12),
          province: z.string(),
          regency: z.string(),
          district: z.string(),
          village: z.string(),
          street: z
            .string({
              required_error: "Required",
              invalid_type_error: "Must be a string",
            })
            .min(10),
          postalCode: z
            .string({
              required_error: "Required",
              invalid_type_error: "Must be a string",
            })
            .length(5),
        })
        .required()
    )
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
  delete: adminProcedure
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
