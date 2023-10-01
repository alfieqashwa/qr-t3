import type { Role } from "@prisma/client"
import type { Table } from "@tanstack/react-table"
import type { LucideIcon } from "lucide-react"
import { Calendar, Key, X } from "lucide-react"
import { DataTableFacetedFilter } from "~/components/table/data-table-faceted-filter"
import { DataTableViewOptions } from "~/components/table/data-table-view-options"
import { Button } from "~/ui/button"
import { Input } from "~/ui/input"
import { api } from "~/utils/api"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function UserTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getPreFilteredRowModel().rows.length >
    table.getFilteredRowModel().rows.length

  type Options = {
    value: Role
    label: Role
    icon?: LucideIcon
  }

  /**
   *
   * Follow the sequence below, otherwise this bug will occured:
   * Bugs: uncaught-invariant-violation-rendered-more-hooks-than-during-the-previous-rende
   *
   * STEPS:
   * 1. Call all the required Apis
   * 2. Then Map the variables
   */
  // Follow the sequence below, otherwise this bug will occured:
  // uncaught-invariant-violation-rendered-more-hooks-than-during-the-previous-rende

  // === STARTS Step 1. Call all the required Apis ===
  const roleQuery = api.user.getRole.useQuery()
  const eventOrganizerQuery = api.eo.getAll.useQuery()
  // === ENDS Step 1. Call all the required Apis ===

  // === STARTS Step 2. Then Map the variables ===
  if (roleQuery.status !== "success") return null
  const roles: Options[] = roleQuery.data.map((d) => ({
    value: d.role,
    label: d.role,
    icon: Key,
  }))

  if (eventOrganizerQuery.status !== "success") return null
  const eventOrganizerTitles = eventOrganizerQuery.data?.map((d) => ({
    value: d.name,
    label: d.name,
    icon: Calendar,
  })) as Options[]
  // === ENDS Step 2. Then Map the variables ===

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter email..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("role") && (
          <DataTableFacetedFilter
            column={table.getColumn("role")}
            title="Role"
            options={roles}
          />
        )}
        {table.getColumn("eventOrganizer") && (
          <DataTableFacetedFilter
            column={table.getColumn("eventOrganizer")}
            title="Event Organizer"
            options={eventOrganizerTitles}
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
        <DataTableViewOptions table={table} />
      </span>
    </div>
  )
}
