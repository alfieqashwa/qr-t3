import type { Status } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import { format, formatDistance, subDays } from "date-fns"
import { id } from "date-fns/locale"
import { MapPin, Star } from "lucide-react"
import { DataTableColumnHeader } from "~/components/table/data-table-column-header"
import { Checkbox } from "~/ui/checkbox"
import type { RouterOutputs } from "~/utils/api"
import { RowVisitorActions } from "./row-visitor-actions"

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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Star className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="whitespace-nowrap capitalize">
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
          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
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
          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("email")}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "event",
    accessorFn: (row) => row.event.title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event" />
    ),
    cell: ({ row }) => {
      const eventTitle = row.getValue("event")
      return (
        <div className="flex items-center">
          <span className="whitespace-nowrap font-medium capitalize">
            {eventTitle as string}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "ticketCategory",
    accessorFn: (row) => row.ticket.category,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ticket Category" />
    ),
    cell: ({ row }) => {
      const ticketCategory = row.getValue("ticketCategory")
      return (
        <div className="flex items-center">
          <span className="whitespace-nowrap font-medium uppercase">
            {ticketCategory as string}
          </span>
        </div>
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
      const ticketStatus = row.getValue("ticketStatus")
      return (
        <div className="flex items-center">
          <span className="whitespace-nowrap font-medium capitalize">
            {ticketStatus as Status}
          </span>
        </div>
      )
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
        <div className="flex items-center">
          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
          {isCheckIn ? (
            <span className="capitalize">check in</span>
          ) : (
            <span className="capitalize">check out</span>
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
      <DataTableColumnHeader column={column} title="Check In Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="whitespace-nowrap">
          {row.getValue("checkInDate") !== null ? (
            format(row.getValue("checkInDate"), "PPPpp", { locale: id })
          ) : (
            <p className="text-center">-</p>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CreatedAt" />
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
      <DataTableColumnHeader column={column} title="UpdatedAt" />
    ),
    cell: ({ row }) => {
      const date = formatDistance(
        subDays(row.getValue("updatedAt"), 0),
        new Date(),
        {
          addSuffix: true,
          locale: id,
        }
      )
      return <div className="whitespace-nowrap">{date}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const {
        original: { id, name },
      } = row
      return <RowVisitorActions id={id} title={name} />
    },
  },
]
