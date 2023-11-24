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
    phone: z.string().min(12).max(14),
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
    postalCode: z.string().length(5),
  })
  .required()

export const createEventOrganizerSchema = updateEventOrganizerSchema.omit({
  id: true,
})

// EVENTS

// default schema
const categorySchema = z.object({
  id: z.string().cuid(),
  name: z
    .string({
      required_error: "Category is required",
      invalid_type_error: "Category must be a string",
    })
    .min(3, { message: "Category must be at least 3 characters." })
    .max(15, { message: "Category must contain at most 15 character(s)" }),
  price: z.coerce.number({
    required_error: "Price is required",
    invalid_type_error: "Price must be a number",
  }),
})

// for form validation
export const categoryFormValidationSchema = categorySchema
  .omit({ price: true })
  .extend({
    price: z.string({
      required_error: "Price is required",
      invalid_type_error: "Price must be a numeric-character",
    }),
  })

// for event mutation API
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
    .min(3, {
      message: "Venue must be at least 3 characters.",
    })
    .max(25),
  profit: z.boolean().optional(),
  date: z.date({
    required_error: "A date of event is required.",
  }),
  categories: z.array(categorySchema),
})

export const extendUpdateEventSchema = updateEventSchema
  .omit({ categories: true })
  .extend({
    categories: z.array(categoryFormValidationSchema),
  })

// for event mutation API
export const createEventSchema = updateEventSchema
  .omit({
    id: true,
    categories: true,
  })
  .extend({
    categories: z.array(categorySchema.omit({ id: true })),
  })

export const extendCreateEventSchema = updateEventSchema
  .omit({ id: true, categories: true })
  .extend({
    categories: z.array(categoryFormValidationSchema.omit({ id: true })),
  })

// TICKETS
export const generateTicketSchema = z.object({
  eventId: z
    .string({
      required_error: "Event is required",
      invalid_type_error: "EventId must be a string",
    })
    .cuid({ message: "invalid Event" }),
  categoryId: z
    .string({
      required_error: "Category is required",
      invalid_type_error: "Category must be a string",
    })
    .cuid({ message: "Invalid Category" }),
  qty: z.coerce
    .number({
      required_error: "Qty is required",
      invalid_type_error: "Qty must be a number",
    })
    .int()
    .gte(10, { message: "Qty must be greater than or equal to 10" }),
})

// VISITORS
const visitorSchema = z.object({
  id: z.string().cuid(),
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(3, {
      message: "Name must be at least 3 character(s)",
    })
    .max(25, { message: "Name must contain at most 25 character(s)" }),
  phone: z
    .string({
      required_error: "Phone is required",
      invalid_type_error: "Phone must be a string",
    })
    .min(12, { message: "Phone must contain at least 12 character(s)" })
    .max(14, { message: "Phone must contain at most 14 character(s)" }),
  email: z.optional(z.string().email()),
  ticketId: z
    .string({
      required_error: "Ticket is required",
      invalid_type_error: "Ticket must be a string",
    })
    .cuid({ message: "Ticket is required" }),
})

// TODO: erase bcoz duplicated
export const createPublicVisitorSchema = visitorSchema.omit({
  id: true,
})
export const extendCreatePublicVisitorSchema = createPublicVisitorSchema.extend(
  {
    categoryId: z
      .string({
        required_error: "Category is required",
        invalid_type_error: "Category must be a string",
      })
      .cuid({
        message: "Category is required",
      }),
  },
)

export const createVisitorSchema = visitorSchema.omit({
  id: true,
})

export const extendVisitorFormSchema = createVisitorSchema.extend({
  eventId: z
    .string({
      required_error: "Event is required",
      invalid_type_error: "Event must be a string",
    })
    .cuid({ message: "Event is required" }),
  categoryId: z
    .string({
      required_error: "Category is required",
      invalid_type_error: "Category must be a string",
    })
    .cuid({
      message: "Category is required",
    }),
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
