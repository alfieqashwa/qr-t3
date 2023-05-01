import { createTRPCRouter, protectedProcedure } from "../trpc"
import { REGENCIES } from "@/src/constants/regencies"
import { PROVINCES } from "@/src/constants/provinces"
import { DISTIRCTS } from "@/src/constants/districts"
import { VILLAGES } from "@/src/constants/villages"

export const addressRouter = createTRPCRouter({
  getProvinces: protectedProcedure.query(() => PROVINCES),
  getRegencies: protectedProcedure.query(() => REGENCIES),
  getDistricts: protectedProcedure.query(() => DISTIRCTS),
  getVillages: protectedProcedure.query(() => VILLAGES)
})
