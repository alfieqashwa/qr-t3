import { createTRPCRouter, protectedProcedure } from "../trpc"

export const addressRouter = createTRPCRouter({
  provinces: protectedProcedure.query(async ({ ctx }) => await ctx.prisma.province.findMany()),
  regencies: protectedProcedure.query(async ({ ctx }) => await ctx.prisma.regency.findMany()),
  districts: protectedProcedure.query(async ({ ctx }) => await ctx.prisma.district.findMany()),
  villages: protectedProcedure.query(async ({ ctx }) => await ctx.prisma.village.findMany())
})