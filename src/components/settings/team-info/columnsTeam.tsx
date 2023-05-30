import type { ColumnDef } from "@tanstack/react-table";
import { format, formatDistance, subDays } from "date-fns";
import { id } from "date-fns/locale";
import { Key, MapPin, Star } from "lucide-react";
import { DataTableColumnHeader } from "~/components/table/data-table-column-header";
import { Badge } from "~/ui/badge";
import { Checkbox } from "~/ui/checkbox";
import type { RouterOutputs } from "~/utils/api";
import { DeleteTeam } from "./delete-team";
import { UpdateTeam } from "./update-team";

export const columnsTeam: ColumnDef<
  RouterOutputs["user"]["getAllByEOId"][0]
>[] = [
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
    accessorKey: "image",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Image" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Star className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="uppercase">{row.getValue("image")}</span>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Star className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="uppercase">{row.getValue("name")}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Star className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="uppercase">{row.getValue("email")}</span>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const role = row.original.role;
      if (!role) return null;
      return (
        <div className="flex items-center">
          <Key className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="uppercase">{row.getValue("role")}</span>
        </div>
      );
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "event",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event" />
    ),
    cell: ({ row }) => {
      const event = row.original.eventOrganizer?.name;
      if (!event) return null;
      return (
        <div className="flex space-x-2">
          <Badge
            variant="secondary"
            className="bg-amber-700 py-1.5 px-3 hover:bg-amber-700/50"
          >
            <span className="max-w-[500px] truncate font-medium capitalize">
              {event}
            </span>
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "update",
    cell: ({ row }) => {
      const {
        original: { id, name, role },
      } = row;

      return <UpdateTeam id={id} username={name} currentRole={role} />;
    },
  },
  {
    id: "delete",
    cell: ({ row }) => {
      const {
        original: { id, email },
      } = row;
      return <DeleteTeam id={id} email={email} />;
    },
  },
];
