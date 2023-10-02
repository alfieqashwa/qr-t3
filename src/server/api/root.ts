import { accountRouter } from "./routers/account"
import { addressRouter } from "./routers/address"
import { eoRouter } from "./routers/eo"
import { eventRouter } from "./routers/event"
import { sessionRouter } from "./routers/session"
import { ticketRouter } from "./routers/ticket"
import { userRouter } from "./routers/user"
import { visitorRouter } from "./routers/visitor"
import { createTRPCRouter } from "./trpc"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  eo: eoRouter,
  address: addressRouter,
  event: eventRouter,
  ticket: ticketRouter,
  visitor: visitorRouter,
  account: accountRouter,
  session: sessionRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
