import type { Status } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import { Calendar, Tags } from "lucide-react"
import { DataTableColumnHeader } from "~/components/table/data-table-column-header"
import { Badge } from "~/ui/badge"
import { Checkbox } from "~/ui/checkbox"
import type { RouterOutputs } from "~/utils/api"
import { statuses } from "./data"
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
        onCheckedChange={(value) =>
          row.toggleSelected(!!value && row.original.status === "AVAILABLE")
        }
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
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="price" />
    ),
    cell: ({ row }) => {
      const price = row.getValue("price")
      const formatPrice = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(Number(price))
      return <div className="w-[80px]">{formatPrice}</div>
    },
  },
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
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
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
