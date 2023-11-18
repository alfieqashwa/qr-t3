import type { Status } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import { Calendar, Mail, Tags, User } from "lucide-react"
import { DataTableColumnHeader } from "~/components/table/data-table-column-header"
import { STATUS } from "~/constants/status"
import { cn } from "~/src/utils"
import { Badge } from "~/ui/badge"
import { Checkbox } from "~/ui/checkbox"
import type { RouterOutputs } from "~/utils/api"
import { RowSeatActions } from "./row-seat-actions"

export const columnsSeat: ColumnDef<RouterOutputs["ticket"]["getAll"][0]>[] = [
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
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-auto">{row.getValue("id")}</div>,
  },
  // ! It's not too necessary for now
  // {
  //   accessorKey: "ticketNumber",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Seat No" />
  //   ),
  //   cell: ({ row }) => (
  //     <div className="w-auto">{row.getValue("ticketNumber")}</div>
  //   ),
  // },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="whitespace-nowrap px-3 py-1.5">
        <Tags className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="max-w-[500px] truncate font-medium uppercase">
          {row.getValue("category")}
        </span>
      </Badge>
    ),
    filterFn: (row, id, value: Status) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "event",
    accessorFn: (row) => row.event?.title,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="whitespace-nowrap font-medium capitalize">
            {row.getValue("event")}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = STATUS.find(
        (status) => status.value === row.getValue("status"),
      )

      if (!status) {
        return null
      }

      const booked = status.value === "BOOKED" && "text-amber-500"
      const purchased = status.value === "PURCHASED" && "text-emerald-500"
      const refund = status.value === "REFUND" && "text-destructive"
      return (
        <div
          className={cn(
            "flex w-[100px] items-center",
            booked,
            purchased,
            refund,
          )}
        >
          {status.icon && (
            <status.icon
              className={cn(
                "mr-2 h-4 w-4 text-muted-foreground",
                booked,
                purchased,
                refund,
              )}
            />
          )}
          <span className="uppercase">{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value: Status) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "visitorName",
    accessorFn: (row) => row.visitor?.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Visitor Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <User className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="whitespace-nowrap font-medium capitalize">
            {row.getValue("visitorName")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "visitorEmail",
    accessorFn: (row) => row.visitor?.email,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Visitor Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="whitespace-nowrap font-medium text-amber-300">
            {row.getValue("visitorEmail")}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const {
        original: { id, status },
      } = row
      return (
        <div className="relative">
          <RowSeatActions id={id} status={status} />
        </div>
      )
    },
  },
]
