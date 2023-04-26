import { REGENCIES } from "@/src/data/address/regencies"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import { PROVINCES } from "@/src/data/address/provinces"
import { DISTIRCTS } from "@/src/data/address/districts"
import { VILLAGES } from "@/src/data/address/villages"

export const addressRouter = createTRPCRouter({
  getProvinces: protectedProcedure.query(() => PROVINCES),
  getRegencies: protectedProcedure.query(() => REGENCIES),
  getDistricts: protectedProcedure.query(() => DISTIRCTS),
  getVillages: protectedProcedure.query(() => VILLAGES)
})