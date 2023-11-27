import type { Status } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import { format, formatDistance, subDays } from "date-fns"
import { id } from "date-fns/locale"
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  Tags,
  User,
  UserCheck,
  UserX,
} from "lucide-react"
import { GenerateQRCode } from "~/components/qrcode"
import { DataTableColumnHeader } from "~/components/table/data-table-column-header"
import { cn } from "~/src/utils"
import { Badge } from "~/ui/badge"
import { Checkbox } from "~/ui/checkbox"
import type { RouterOutputs } from "~/utils/api"
import { RowVisitorActions } from "./row-visitor-actions"
import { TriggerTicketStatus } from "./trigger-ticket-status"

export const columnsVisitor: ColumnDef<
  RouterOutputs["visitor"]["getAll"][0]
>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "qrCode",
    accessorFn: (row) => row.ticket,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="QR Code" />
    ),
    cell: ({ row }) => {
      const {
        original: {
          ticket: { id, status },
          name,
        },
      } = row
      return (
        <GenerateQRCode
          id={id}
          name={name.replace(/ /g, "_")}
          ticketStatus={status}
        />
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <User className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="whitespace-nowrap font-medium capitalize">
          {row.getValue("name")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="uppercase">{row.getValue("phone")}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="whitespace-nowrap font-medium text-amber-300">
            {row.getValue("email")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "ticketCategory",
    accessorFn: (row) => row.ticket.category?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ticket Category" />
    ),
    cell: ({ row }) => {
      const ticketCategory = row.getValue("ticketCategory")
      return (
        <Badge variant="secondary" className="px-3 py-1.5">
          <Tags className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="max-w-[500px] whitespace-nowrap font-medium uppercase text-amber-300">
            {ticketCategory as string}
          </span>
        </Badge>
      )
    },
  },
  {
    accessorKey: "ticketStatus",
    accessorFn: (row) => row.ticket.status,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ticket Status" />
    ),
    cell: ({ row }) => {
      const {
        original: {
          ticket: { id, status, category },
        },
      } = row
      if (!status) return null
      return (
        <TriggerTicketStatus
          id={id}
          ticketStatus={status}
          isProfit={category?.price !== 0}
        />
      )
    },
    filterFn: (row, id, value: Status) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "eventTitle",
    accessorFn: (row) => row.ticket.event?.title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event" />
    ),
    cell: ({ row }) => {
      const {
        original: {
          ticket: { event },
        },
      } = row
      const profit = event?.profit
      return (
        <div className="flex items-center whitespace-nowrap">
          <Calendar
            className={cn(
              "mr-2 h-4 w-4",
              !!profit ? "text-amber-300" : "text-muted-foreground",
            )}
          />
          <span className="whitespace-nowrap font-medium capitalize">
            {row.getValue("eventTitle")}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "isCheckIn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is Check In" />
    ),
    cell: ({ row }) => {
      const isCheckIn = row.getValue("isCheckIn")

      return (
        <div
          className={cn(
            `flex items-center`,
            isCheckIn ? "text-emerald-300" : "text-primary",
          )}
        >
          {isCheckIn ? (
            <>
              <UserCheck className="mr-2 h-4 w-4" />
              <span className="capitalize">check in</span>
            </>
          ) : (
            <>
              <UserX className="mr-2 h-4 w-4" />
              <span className="capitalize">check out</span>
            </>
          )}
        </div>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "checkInDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Check In" />
    ),
    cell: ({ row }) => {
      const checkInDate = row.getValue("checkInDate")
      return (
        <div className="flex items-center whitespace-nowrap">
          <Clock
            className={cn(
              "mr-2 h-4 w-4 text-emerald-300",
              checkInDate ?? "text-muted-foreground",
            )}
          />
          <span>
            {checkInDate !== null
              ? format(checkInDate as Date, "PPPpp", { locale: id })
              : "-"}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "checkOutDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Check Out" />
    ),
    cell: ({ row }) => {
      const checkOutDate = row.getValue("checkOutDate")
      return (
        <div className="flex items-center whitespace-nowrap">
          <Clock
            className={cn(
              "mr-2 h-4 w-4 text-destructive",
              checkOutDate ?? "text-muted-foreground",
            )}
          />
          <span>
            {checkOutDate !== null
              ? format(checkOutDate as Date, "PPPpp", { locale: id })
              : "-"}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {format(row.getValue("createdAt"), "PPPpp", { locale: id })}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      const date = formatDistance(
        subDays(row.getValue("updatedAt"), 0),
        new Date(),
        {
          addSuffix: true,
          locale: id,
        },
      )
      return <div className="whitespace-nowrap">{date}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const {
        original: {
          id,
          name,
          ticket: { status },
        },
      } = row
      return (
        <div className="relative">
          <RowVisitorActions id={id} title={name} ticketStatus={status} />
        </div>
      )
    },
  },
]
