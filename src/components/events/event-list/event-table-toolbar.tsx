import type { Table } from "@tanstack/react-table"
import type { LucideIcon } from "lucide-react"
import { MapPin, X } from "lucide-react"
import { DataTableFacetedFilter } from "~/components/table/data-table-faceted-filter"
import { DataTableViewOptions } from "~/components/table/data-table-view-options"
import { Button } from "~/ui/button"
import { Input } from "~/ui/input"
import { api } from "~/utils/api"
import { CreateNewEvent } from "./create-new-event"
import { DeleteEventList } from "./delete-event-list"
import { AdminOnly } from "../../authed"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function EventTableToolbar<TData>({
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

  const { data, status } = api.event.eventData.useQuery()
  const venues = data?.map((d) => ({
    value: d.venue,
    label: d.venue,
    icon: MapPin,
  })) as Options[]

  return (
    <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div className="flex flex-col items-start space-y-1 sm:flex-1 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
        <Input
          placeholder="Filter events..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {status === "success" && table.getColumn("venue") && (
          <DataTableFacetedFilter
            column={table.getColumn("venue")}
            title="Venue"
            options={venues}
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
      <span className="flex items-center space-x-6">
        <AdminOnly>
          {!table.getFilteredSelectedRowModel().rows.length ? (
            <CreateNewEvent />
          ) : (
            <DeleteEventList table={table} />
          )}
        </AdminOnly>
        <DataTableViewOptions table={table} />
      </span>
    </div>
  )
}
