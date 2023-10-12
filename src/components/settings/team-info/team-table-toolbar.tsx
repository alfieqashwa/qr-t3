import type { Role } from "@prisma/client"
import type { Table } from "@tanstack/react-table"
import type { LucideIcon } from "lucide-react"
import { Key, X } from "lucide-react"
import { AdminOnly } from "~/components/authed"
import { DataTableFacetedFilter } from "~/components/table/data-table-faceted-filter"
import { DataTableViewOptions } from "~/components/table/data-table-view-options"
import { Button } from "~/ui/button"
import { Input } from "~/ui/input"
import { api } from "~/utils/api"
import { CreateTeam } from "./create-team"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function TeamTableToolbar<TData>({
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

  const { data, status } = api.user.getRoleAdminRole.useQuery()
  if (status !== "success") return null
  const roles: Options[] = data
    .filter((f) => f.role === "EDITOR" || f.role === "OPERATOR")
    .map((d) => ({
      value: d.role,
      label: d.role,
      icon: Key,
    }))

  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-col items-start space-y-1 md:flex-1 md:flex-row md:items-center md:space-x-2 md:space-y-0">
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
          <CreateTeam />
        </AdminOnly>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
