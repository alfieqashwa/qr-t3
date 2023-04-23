import { createTRPCRouter } from "./trpc"
import { exampleRouter } from "./routers/example"
import { userRouter } from "./routers/user"
import { eoRouter } from "./routers/eo"
import { addressRouter } from "./routers/address"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user: userRouter,
  eo: eoRouter,
  address: addressRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
