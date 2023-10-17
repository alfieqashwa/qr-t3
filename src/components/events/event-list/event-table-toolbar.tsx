import type { Table } from "@tanstack/react-table"
import type { LucideIcon } from "lucide-react"
import { CheckCircle2, DollarSign, MapPin, X } from "lucide-react"
import { AdminOnly } from "~/components/authed"
import { DataTableFacetedFilter } from "~/components/table/data-table-faceted-filter"
import { DataTableViewOptions } from "~/components/table/data-table-view-options"
import { Button } from "~/ui/button"
import { Input } from "~/ui/input"
import { api } from "~/utils/api"
import { CreateNewEvent } from "./create-new-event"
import { DeleteEventList } from "./delete-event-list"

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

  const { data: events, status } = api.event.eventData.useQuery(undefined, {
    select: (events) => {
      const all = events
      const _nonProfits = events.map((event) => event.nonProfit)
      return {
        all,
        nonProfits: [...new Set(_nonProfits)],
      }
    },
  })

  const venues = events?.all.map((d) => ({
    value: d.venue,
    label: d.venue,
    icon: MapPin,
  })) as Options[]

  const nonProfits = events?.nonProfits?.map((isNonProfit) => {
    const _isNonProfit = isNonProfit ? "Non Profit" : "Profit"
    return {
      value: isNonProfit,
      label: _isNonProfit,
      icon: isNonProfit ? CheckCircle2 : DollarSign,
    }
  }) as unknown as Options[] // boolean --> string

  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-col items-start space-y-1 md:flex-1 md:flex-row md:items-center md:space-x-2 md:space-y-0">
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
        {status === "success" && table.getColumn("nonProfit") && (
          <DataTableFacetedFilter
            column={table.getColumn("nonProfit")}
            title="Non Profit"
            options={nonProfits}
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
      <div className="flex flex-col space-y-1 md:flex-row-reverse md:space-y-0">
        <AdminOnly>
          {!table.getFilteredSelectedRowModel().rows.length ? (
            <CreateNewEvent />
          ) : (
            <DeleteEventList table={table} />
          )}
        </AdminOnly>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
