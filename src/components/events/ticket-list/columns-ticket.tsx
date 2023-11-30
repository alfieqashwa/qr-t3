import type { Status } from "@prisma/client"
import type { ColumnDef } from "@tanstack/react-table"
import { BadgeCent, Calendar, Hash, Mail, Tags, User } from "lucide-react"
import { DataTableColumnHeader } from "~/components/table/data-table-column-header"
import { STATUS } from "~/constants/status"
import { cn } from "~/src/utils"
import { Badge } from "~/ui/badge"
import { Checkbox } from "~/ui/checkbox"
import type { RouterOutputs } from "~/utils/api"
import { RowTicketActions } from "./row-ticket-actions"

export const columnsTicket: ColumnDef<RouterOutputs["ticket"]["getAll"][0]>[] =
  [
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
      cell: ({ row }) => (
        <Badge variant="secondary" className="px-3 py-1.5">
          <Hash className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("id")}
          </span>
        </Badge>
      ),
    },
    {
      accessorKey: "price",
      accessorFn: (row) => row.category?.price,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ row }) => {
        const price = row.getValue("price")
        const formatPrice = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(Number(price))
        return (
          <Badge variant="secondary" className="px-3 py-1.5">
            <BadgeCent className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="max-w-[500px] truncate font-medium capitalize text-amber-300">
              {formatPrice}
            </span>
          </Badge>
        )
      },
    },
    {
      accessorKey: "category",
      accessorFn: (row) => row.category?.name,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary" className="px-3 py-1.5">
          <Tags className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="max-w-[500px] truncate font-medium uppercase text-amber-300">
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
          <div className="flex items-center whitespace-nowrap">
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

        const available =
          status.value === "AVAILABLE" && "text-muted-foreground"
        const booked = status.value === "BOOKED" && "text-amber-500"
        const purchased = status.value === "PURCHASED" && "text-emerald-500"
        const refund = status.value === "REFUND" && "text-destructive"
        return (
          <div className={cn("flex items-center", booked, purchased, refund)}>
            {status.icon && (
              <status.icon
                className={cn(
                  "mr-2 h-4 w-4",
                  available,
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
            <RowTicketActions id={id} status={status} />
          </div>
        )
      },
    },
  ]
