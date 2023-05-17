import { DISTRICTS } from "~/src/constants/districts"
import { PROVINCES } from "~/src/constants/provinces"
import { REGENCIES } from "~/src/constants/regencies"
import { VILLAGES } from "~/src/constants/villages"
import { createTRPCRouter, protectedProcedure } from "../trpc"

export const addressRouter = createTRPCRouter({
  getProvinces: protectedProcedure.query(() => PROVINCES),
  getRegencies: protectedProcedure.query(() => REGENCIES),
  getDistricts: protectedProcedure.query(() => DISTRICTS),
  getVillages: protectedProcedure.query(() => VILLAGES)
})
