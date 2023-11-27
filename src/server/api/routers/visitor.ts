import { z } from "zod"
import {
  createPublicVisitorSchema,
  createVisitorSchema,
  updateVisitorSchema,
} from "~/types/schema"
import {
  adminProcedure,
  createTRPCRouter,
  editorProcedure,
  operatorProcedure,
  protectedProcedure,
  publicProcedure,
} from "../trpc"

export const visitorRouter = createTRPCRouter({
  // Queries - Protected Procedure
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.visitor.findMany({
      orderBy: { name: "asc" },
      include: {
        ticket: {
          select: {
            id: true,
            category: { select: { name: true, price: true } },
            status: true,
            event: { select: { title: true, profit: true } },
          },
        },
      },
    })
  }),
  getById: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.visitor.findUnique({
        where: { id },
      })
    }),
  isCheckIn: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.visitor.findMany({
      select: { isCheckIn: true },
    })
  }),

  // Mutations - Public Procedure
  createPublic: publicProcedure
    .input(createPublicVisitorSchema)
    .mutation(async ({ ctx, input: { name, phone, email, ticketId } }) => {
      return await ctx.prisma.visitor.create({
        data: {
          name,
          phone,
          email,
          ticketId,
        },
      })
    }),
  // Mutations - Operator Procedure
  toggleCheckOperatorRole: operatorProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        isCheckIn: z.boolean(),
        checkInDate: z.date().optional(),
        checkOutDate: z.date().optional(),
      }),
    )
    .mutation(
      async ({ ctx, input: { id, isCheckIn, checkInDate, checkOutDate } }) => {
        return await ctx.prisma.visitor.update({
          where: { id },
          data: { isCheckIn, checkInDate, checkOutDate },
        })
      },
    ),
  // Mutations - Editor Procedure
  createEditorRole: editorProcedure
    .input(createVisitorSchema)
    .mutation(async ({ ctx, input: { name, phone, email, ticketId } }) => {
      const createTicket = await ctx.prisma.visitor.create({
        data: {
          name,
          phone,
          email,
          ticketId,
        },
      })
      const updateStatus = await ctx.prisma.ticket.update({
        where: { id: ticketId },
        data: { status: "BOOKED" },
      })
      return { createTicket, updateStatus }
    }),
  updateEditorRole: editorProcedure
    .input(updateVisitorSchema)
    .mutation(async ({ ctx, input: { id, name, phone, email } }) => {
      return await ctx.prisma.visitor.update({
        where: { id },
        data: {
          name,
          phone,
          email,
        },
      })
    }),
  deleteEditorRole: editorProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.visitor.delete({
        where: { id },
      })
    }),

  // Mutations - Admin Procedure
  deleteSelectedAdminRole: adminProcedure
    .input(
      z.array(
        z.object({
          id: z.string().cuid(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.visitor.deleteMany({
        where: {
          OR: input,
        },
      })
    }),
})
