import { Role } from "@prisma/client"
import { z } from "zod"

export const createTeamSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(Role),
})