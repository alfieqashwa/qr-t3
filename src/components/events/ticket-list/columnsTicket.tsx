import type { Status } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "~/components/table/data-table-column-header";
import { Badge } from "~/ui/badge";
import { Checkbox } from "~/ui/checkbox";
import type { RouterOutputs } from "~/utils/api";
import { statuses } from "./data";
import { DeleteTicket } from "./delete-ticket";

export const columnsTicket: ColumnDef<RouterOutputs["ticket"]["getAll"][0]>[] =
  [
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
      accessorKey: "sku",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="SKU" />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("sku")}</div>,
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Badge
            variant="secondary"
            className="bg-emerald-700 hover:bg-emerald-700/50"
          >
            <span className="max-w-[500px] truncate font-medium uppercase">
              {row.getValue("category")}
            </span>
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="price" />
      ),
      cell: ({ row }) => {
        const price = row.getValue("price");
        const formatPrice = new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(Number(price));
        return <div className="w-[80px]">{formatPrice}</div>;
      },
    },
    {
      accessorKey: "event",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Event" />
      ),
      cell: ({ row }) => {
        const event = row.original.event;
        if (!event) {
          return null;
        }
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium capitalize">
              {event.title}
            </span>
          </div>
        );
      },
      filterFn: (row, _id, value: string) => {
        return value.includes(row.original.event?.title as string);
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = statuses.find(
          (status) => status.value === row.getValue("status")
        );

        if (!status) {
          return null;
        }

        return (
          <div className="flex w-[100px] items-center">
            {status.icon && (
              <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
            <span className="uppercase">{status.label}</span>
          </div>
        );
      },
      filterFn: (row, id, value: Status) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const {
          original: { id, sku, status },
        } = row;

        return <DeleteTicket id={id} sku={sku} status={status} />;
      },
    },
    // { id: "actions", cell: ({ row }) => <DataTableRowActions row={row} /> },
  ];
