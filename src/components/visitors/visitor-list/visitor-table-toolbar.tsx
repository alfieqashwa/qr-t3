import type { Table } from "@tanstack/react-table"
import type { LucideIcon } from "lucide-react"
import { MapPin, X } from "lucide-react"
import { DataTableFacetedFilter } from "~/components/table/data-table-faceted-filter"
import { DataTableViewOptions } from "~/components/table/data-table-view-options"
import { Button } from "~/ui/button"
import { Input } from "~/ui/input"
import { api } from "~/utils/api"
import { AdminOnly } from "../../authed"
import { CreateNewVisitor } from "./create-new-visitor"

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

  // return {
  // }
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter visitor..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
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
      <span className="flex items-center space-x-4">
        <AdminOnly>
          {table.getFilteredSelectedRowModel().rows.length > 0 ? (
            // TODO
            // <DeleteEventList table={table} />
            <p>Delete Visitor</p>
          ) : (
            <CreateNewVisitor />
          )}
        </AdminOnly>
        <DataTableViewOptions table={table} />
      </span>
    </div>
  )
}
