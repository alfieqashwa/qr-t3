import { Role } from "@prisma/client"
import { z } from "zod"

export const createTeamSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(Role),
})

export const createEventSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters."
  }).max(25),
  thumbnail: z.string().url().nullable(),
  venue: z.string().min(5, {
    message: "Venue must be at least 5 characters."
  }).max(25),
  date: z.date({
    required_error: "A date of event is required.",
  }),
})