import type { Table } from "@tanstack/react-table"
import type { LucideIcon } from "lucide-react"
import { Calendar, MapPin, X } from "lucide-react"
import { EditorOnly } from "~/components/authed"
import { DataTableFacetedFilter } from "~/components/table/data-table-faceted-filter"
import { DataTableViewOptions } from "~/components/table/data-table-view-options"
import { STATUS } from "~/constants/status"
import { Button } from "~/ui/button"
import { Input } from "~/ui/input"
import { api } from "~/utils/api"
import { CreateNewVisitor } from "./create-new-visitor"
import { DeleteVisitorList } from "./delete-visitor-list"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function VisitorTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getPreFilteredRowModel().rows.length >
    table.getFilteredRowModel().rows.length

  type Options = {
    label: string
    value: string
    icon?: LucideIcon
  }

  const { data: ticketCount } = api.ticket.count.useQuery()
  const { data: events } = api.event.eventData.useQuery(undefined, {
    select: (events) => {
      const options: Options[] = [
        ...new Set(events.map((event) => event.title)),
      ].map((title) => ({
        value: title,
        label: title,
        icon: Calendar,
      }))

      return { options }
    },
  })

  const ischeckInQuery = api.visitor.isCheckIn.useQuery(undefined, {
    select: (data) => {
      const isCheckIn = data.map((d) => d.isCheckIn)
      return [...new Set(isCheckIn)]
    },
  })

  const isCheckIn = ischeckInQuery?.data?.map((isCheck) => {
    const _isCheckIn = isCheck ? "check in" : "check out"
    return {
      value: _isCheckIn,
      label: _isCheckIn,
      icon: MapPin,
    }
  }) as Options[]

  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-col items-start space-y-1 md:flex-1 md:flex-row md:items-center md:space-x-2 md:space-y-0">
        <Input
          placeholder="Filter visitor..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("ticketStatus") && (
          <DataTableFacetedFilter
            column={table.getColumn("ticketStatus")}
            title="Status"
            options={STATUS as unknown as Options[]}
          />
        )}
        {table.getColumn("eventTitle") && (
          <DataTableFacetedFilter
            column={table.getColumn("eventTitle")}
            title="Event"
            options={events?.options as Options[]}
          />
        )}
        {ischeckInQuery.status === "success" &&
          table.getColumn("isCheckIn") && (
            <DataTableFacetedFilter
              column={table.getColumn("isCheckIn")}
              title="Is Check In"
              options={isCheckIn}
            />
          )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex flex-col space-y-1 md:flex-row-reverse md:space-x-2 md:space-y-0">
        <EditorOnly>
          {!table.getFilteredSelectedRowModel().rows.length ? (
            !!ticketCount && <CreateNewVisitor />
          ) : (
            <DeleteVisitorList table={table} />
          )}
        </EditorOnly>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
