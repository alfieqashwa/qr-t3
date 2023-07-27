import { Role } from "@prisma/client"
import { z } from "zod"

export const createTeamSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(Role),
})

export const createEventSchema = z.object({
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
  date: z.date({
    required_error: "A date of event is required.",
  }),
})

export const updateEventSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(5).max(25),
  venue: z.string().min(5).max(25),
  date: z.date(),
})


export const createVisitorSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters.",
    })
    .max(25),
  phone: z
    .string({
      required_error: "Phone is required",
      invalid_type_error: "Phone must be a string",
    })
    .min(7)
    .max(12),
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  }).email(),
  eventId: z.string({
    required_error: "Event is required",
    invalid_type_error: "Event must be a string",
  }).cuid({
    message: "Event is required"
  }),
  ticketId: z.string({
    required_error: "Ticket is required",
    invalid_type_error: "Ticket must be a string",
  }).cuid({ message: "Ticket is required" }),
})