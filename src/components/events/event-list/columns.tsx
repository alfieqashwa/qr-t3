import type { Status } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DataTableColumnHeader } from "~/components/table/data-table-column-header";
import { Badge } from "~/ui/badge";
import { Checkbox } from "~/ui/checkbox";
import type { RouterOutputs } from "~/utils/api";
// import { statuses } from "./data";
// import { DeleteTicket } from "./delete-ticket";

export const columns: ColumnDef<RouterOutputs["event"]["getAll"][0]>[] = [
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
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-auto">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Badge
          variant="secondary"
          className="bg-amber-700 py-1.5 px-3 hover:bg-amber-700/50"
        >
          <span className="max-w-[500px] truncate font-medium capitalize">
            {format(row.getValue("date"), "PPPP", { locale: id })}
          </span>
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "venue",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Venue" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Badge
          variant="secondary"
          className="bg-emerald-700 py-1.5 px-3 hover:bg-emerald-700/50"
        >
          <span className="max-w-[500px] truncate font-medium capitalize">
            {row.getValue("venue")}
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
      <div className="capitalize">
        {format(row.getValue("createdAt"), "PPPpp", { locale: id })}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="UpdatedAt" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        {format(row.getValue("updatedAt"), "PPPpp", { locale: id })}
      </div>
    ),
  },
  // {
  //   accessorKey: "status",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Status" />
  //   ),
  //   cell: ({ row }) => {
  //     const status = statuses.find(
  //       (status) => status.value === row.getValue("status")
  //     );

  //     if (!status) {
  //       return null;
  //     }

  //     return (
  //       <div className="flex w-[100px] items-center">
  //         {status.icon && (
  //           <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span className="uppercase">{status.label}</span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value: Status) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const {
  //       original: { id, sku, status },
  //     } = row;

  //     return <DeleteTicket id={id} sku={sku} status={status} />;
  //   },
  // },
  // { id: "actions", cell: ({ row }) => <DataTableRowActions row={row} /> },
];
