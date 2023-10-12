"use client"

import type { Table } from "@tanstack/react-table"
import type { LucideIcon } from "lucide-react"
import { Calendar, Tags, X } from "lucide-react"
import { EditorOnly } from "~/components/authed"
import { DataTableFacetedFilter } from "~/components/table/data-table-faceted-filter"
import { DataTableViewOptions } from "~/components/table/data-table-view-options"
import { Button } from "~/ui/button"
import { Input } from "~/ui/input"
import { api } from "~/utils/api"
import { statuses } from "./data"
import { DeleteTicketList } from "./delete-ticket-list"
import { GenerateTicket } from "./generate-ticket"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function TicketTableToolbar<TData>({
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

  const categoryQuery = api.ticket.categories.useQuery(undefined, {
    select: (data) => {
      const categories = data.map((d) => d.category)
      return [...new Set(categories)]
    },
  })
  const categories = categoryQuery.data?.map((cat) => ({
    value: cat,
    label: cat,
    icon: Tags,
  })) as Options[]

  const eventQuery = api.event.eventData.useQuery()
  const eventTitles = eventQuery.data?.map((d) => ({
    value: d.title,
    label: d.title,
    icon: Calendar,
  })) as Options[]

  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-col items-start space-y-1 md:flex-1 md:flex-row md:items-center md:space-x-2 md:space-y-0">
        <Input
          placeholder="Filter tickets..."
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("event") && (
          <DataTableFacetedFilter
            column={table.getColumn("event")}
            title="Event"
            options={eventTitles}
          />
        )}
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("category") && (
          <DataTableFacetedFilter
            column={table.getColumn("category")}
            title="Category"
            options={categories}
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
        <EditorOnly>
          {!table.getFilteredSelectedRowModel().rows.length ? (
            <GenerateTicket />
          ) : (
            <DeleteTicketList table={table} />
          )}
        </EditorOnly>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
