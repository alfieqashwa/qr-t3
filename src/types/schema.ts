import { Role } from "@prisma/client"
import { z } from "zod"

// EVENT ORGANIZERS
export const updateEventOrganizerSchema = z
  .object({
    id: z.string().cuid(),
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .min(3)
      .max(25),
    phone: z.coerce.number().int().positive().min(80_000_000_00),
    province: z.string(),
    regency: z.string(),
    district: z.string(),
    village: z.string(),
    street: z
      .string({
        required_error: "Required",
        invalid_type_error: "Must be a string",
      })
      .min(10),
    postalCode: z.coerce.number().int().positive().min(10_000),
  })
  .required()

export const createEventOrganizerSchema = updateEventOrganizerSchema.omit({
  id: true,
})

// EVENTS
export const updateEventSchema = z.object({
  id: z.string().cuid(),
  title: z
    .string()
    .min(5, {
      message: "Title must be at least 5 characters.",
    })
    .max(25),
  venue: z
    .string()
    .min(5, {
      message: "Venue must be at least 5 characters.",
    })
    .max(25),
  profit: z.boolean().optional(),
  date: z.date({
    required_error: "A date of event is required.",
  }),
})

export const createEventSchema = updateEventSchema.omit({ id: true })

// TICKETS
export const generateTicketSchema = z.object({
  category: z
    .string({
      required_error: "Category is required",
      invalid_type_error: "Category must be a string",
    })
    .min(3)
    .max(15),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .int()
    .gte(10000),
  qty: z
    .number({
      required_error: "Qty is required",
      invalid_type_error: "Qty must be a number",
    })
    .int()
    .gte(10),
  eventId: z
    .string({
      required_error: "EventId is required",
      invalid_type_error: "EventId must be a string",
    })
    .cuid(),
})

// VISITORS
const visitorSchema = z.object({
  eventOrganizerId: z.string().cuid(),
  id: z.string().cuid(),
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters.",
    })
    .max(25),
  phone: z.coerce.number().int().positive().min(80_000_000_00),
  email: z.optional(z.string().email()),
  eventId: z
    .string({
      required_error: "Event is required",
      invalid_type_error: "Event must be a string",
    })
    .cuid({
      message: "Event is required",
    }),
  category: z.string().optional(),
  ticketId: z
    .string({
      required_error: "Ticket is required",
      invalid_type_error: "Ticket must be a string",
    })
    .cuid({ message: "Ticket is required" }),
})

export const createPublicVisitorSchema = visitorSchema.omit({
  id: true,
  // eventOrganizerId: true,
})
export const createVisitorSchema = visitorSchema.omit({
  id: true,
  eventOrganizerId: true,
})

export const updateVisitorSchema = visitorSchema.pick({
  id: true,
  name: true,
  phone: true,
  email: true,
})

// USERS
const userSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  role: z.nativeEnum(Role),
})
export const createTeamSchema = userSchema.omit({ id: true })
export const updateTeamSchema = userSchema.omit({ email: true })
