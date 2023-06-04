"use client";

import type { Table } from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";
import { Calendar, X } from "lucide-react";
import { DataTableFacetedFilter } from "~/components/table/data-table-faceted-filter";
import { DataTableViewOptions } from "~/components/table/data-table-view-options";
import { Button } from "~/ui/button";
import { Input } from "~/ui/input";
import { api } from "~/utils/api";
import { statuses } from "./data";
import { DeleteTicketList } from "./delete-ticket-list";
import { GenerateTicket } from "./generate-ticket";
import { EditorOnly } from "../../authed";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function TicketTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getPreFilteredRowModel().rows.length >
    table.getFilteredRowModel().rows.length;

  type Options = {
    label: string;
    value: string;
    icon?: LucideIcon;
  };

  const { data, status } = api.event.eventData.useQuery();
  const eventTitles = data?.map((d) => ({
    value: d.title,
    label: d.title,
    icon: Calendar,
  })) as Options[];

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tickets..."
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {status === "success" && table.getColumn("event") && (
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
        <EditorOnly>
          {table.getFilteredSelectedRowModel().rows.length > 0 ? (
            <DeleteTicketList table={table} />
          ) : (
            <GenerateTicket />
          )}
        </EditorOnly>
        <DataTableViewOptions table={table} />
      </span>
    </div>
  );
}
