import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const ticketSchema = z.object({
  id: z.string(),
  sku: z.string(),
  event: z.object({
    title: z.string()
  }),
  category: z.string(),
  status: z.string(),
})

export type Ticket = z.infer<typeof ticketSchema>