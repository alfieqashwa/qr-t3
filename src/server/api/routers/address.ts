import { createTRPCRouter, publicProcedure } from "../trpc"
import { PROVINCES } from "@/src/data/address/provinces"

export const addressRouter = createTRPCRouter({
  getProvinces: publicProcedure
    .query(() => {
      return PROVINCES
    }),
})