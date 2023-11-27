import type { ColumnDef } from "@tanstack/react-table"
import { format, formatDistance, subDays } from "date-fns"
import { id } from "date-fns/locale"
import { BadgeCent, Calendar, CheckCircle2, MapPin, Star } from "lucide-react"
import { DataTableColumnHeader } from "~/components/table/data-table-column-header"
import { cn } from "~/src/utils"
import { Badge } from "~/ui/badge"
import { Checkbox } from "~/ui/checkbox"
import type { RouterOutputs } from "~/utils/api"
import { RowEventActions } from "./row-event-actions"

export const columnsEvent: ColumnDef<RouterOutputs["event"]["getAll"][0]>[] = [
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
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="px-3 py-1.5">
        <Star className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="whitespace-nowrap capitalize">
          {row.getValue("title")}
        </span>
      </Badge>
    ),
  },
  {
    accessorKey: "venue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Venue" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="whitespace-nowrap capitalize">
            {row.getValue("venue")}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <Badge variant="secondary" className="px-3 py-1.5">
        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="max-w-[500px] truncate font-medium capitalize">
          {format(row.getValue("date"), "PPPPpp", { locale: id })}
        </span>
      </Badge>
    ),
  },
  {
    accessorKey: "profit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Profit?" />
    ),
    cell: ({ row }) => {
      const profit = row.getValue("profit")
      return (
        <Badge
          variant="secondary"
          className={cn("px-3 py-1.5", !!profit && "text-amber-300")}
        >
          {profit ? (
            <>
              <BadgeCent
                className={cn(
                  "mr-2 h-[18px] w-[18px]",
                  !!profit ? "text-amber-300" : "text-muted-foreground",
                )}
              />
              <span className="whitespace-nowrap capitalize">Profit</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-[18px] w-[18px] text-muted-foreground" />
              <span className="whitespace-nowrap capitalize">Non Profit</span>
            </>
          )}
        </Badge>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
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
        original: { id, title },
      } = row
      return (
        <div className="relative">
          <RowEventActions id={id} title={title} />
        </div>
      )
    },
  },
]
