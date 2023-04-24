import { REGENCIES } from "@/src/data/address/regencies"
import { createTRPCRouter, publicProcedure } from "../trpc"
import { PROVINCES } from "@/src/data/address/provinces"
import { DISTIRCTS } from "@/src/data/address/districts"
import { VILLAGES } from "@/src/data/address/villages"

export const addressRouter = createTRPCRouter({
  getProvinces: publicProcedure.query(() => PROVINCES),
  getRegencies: publicProcedure.query(() => REGENCIES),
  getDistricts: publicProcedure.query(() => DISTIRCTS),
  getVillages: publicProcedure.query(() => VILLAGES)
})