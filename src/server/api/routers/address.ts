import { createTRPCRouter, protectedProcedure } from "../trpc"

export const addressRouter = createTRPCRouter({
  provinces: protectedProcedure.query(async ({ ctx }) => await ctx.prisma.province.findMany({ orderBy: { name: "asc" } })),
  regencies: protectedProcedure.query(async ({ ctx }) => await ctx.prisma.regency.findMany({ orderBy: { name: "asc" } })),
  districts: protectedProcedure.query(async ({ ctx }) => await ctx.prisma.district.findMany({ orderBy: { name: "asc" } })),
  villages: protectedProcedure.query(async ({ ctx }) => await ctx.prisma.village.findMany({ orderBy: { name: "asc" } }))
})