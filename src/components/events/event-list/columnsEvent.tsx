import type { ColumnDef } from "@tanstack/react-table";
import { format, formatDistance, subDays } from "date-fns";
import { id } from "date-fns/locale";
import { MapPin, Star } from "lucide-react";
import { DataTableColumnHeader } from "~/components/table/data-table-column-header";
import { Badge } from "~/ui/badge";
import { Checkbox } from "~/ui/checkbox";
import type { RouterOutputs } from "~/utils/api";
import { DeleteEvent } from "./delete-event";
import { UpdateEvent } from "./update-event";

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
      <div className="flex items-center">
        <Star className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="whitespace-nowrap capitalize">
          {row.getValue("title")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "venue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Venue" />
    ),
    cell: ({ row }) => {
      const venue = row.original.venue;
      if (!venue) return null;
      return (
        <div className="flex items-center">
          <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="uppercase">{venue}</span>
        </div>
      );
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Badge variant="secondary" className="py-1.5 px-3">
          <span className="max-w-[500px] truncate font-medium capitalize">
            {format(row.getValue("date"), "PPPP", { locale: id })}
          </span>
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CreatedAt" />
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
      <DataTableColumnHeader column={column} title="UpdatedAt" />
    ),
    cell: ({ row }) => {
      const date = formatDistance(
        subDays(row.getValue("updatedAt"), 0),
        new Date(),
        {
          addSuffix: true,
          locale: id,
        }
      );
      return <div className="whitespace-nowrap">{date}</div>;
    },
  },
  {
    id: "update",
    cell: ({ row }) => {
      const {
        original: { id, title, venue, date },
      } = row;

      return <UpdateEvent id={id} title={title} venue={venue} date={date} />;
    },
  },
  {
    id: "delete",
    cell: ({ row }) => {
      const {
        original: { id, title },
      } = row;
      return <DeleteEvent id={id} title={title} />;
    },
  },
];
