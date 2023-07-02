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
