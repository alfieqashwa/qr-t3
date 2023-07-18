import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"
import { env } from "~/src/env/client.mjs"

const api = env.NEXT_PUBLIC_ADDRESS_API

export const addressRouter = createTRPCRouter({
  provinces: publicProcedure.query(async () => {
    return fetch(`${api}/provinces.json`).then((res) => res.json())
  }),
  regencies: protectedProcedure
    .input(z.object({ provinceId: z.string() }))
    .query(async ({ input: { provinceId } }) => {
      const response = await fetch(`${api}/regencies/${provinceId}.json`)
      return response.json()
    }),
  districts: protectedProcedure
    .input(z.object({ regencyId: z.string() }))
    .query(async ({ input: { regencyId } }) => {
      const response = await fetch(`${api}/districts/${regencyId}.json`)
      return response.json()
    }),
  villages: protectedProcedure
    .input(z.object({ districtId: z.string() }))
    .query(async ({ input: { districtId } }) => {
      const response = await fetch(`${api}/villages/${districtId}.json`)
      return response.json()
    }),
})
