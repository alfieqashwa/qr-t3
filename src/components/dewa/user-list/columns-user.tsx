import type { ColumnDef } from "@tanstack/react-table"
import { Building2, Key, Mail, User } from "lucide-react"
import Image from "next/image"
import { DataTableColumnHeader } from "~/components/table/data-table-column-header"
import { Badge } from "~/ui/badge"
import { Checkbox } from "~/ui/checkbox"
import type { RouterOutputs } from "~/utils/api"
import { RowUserActions } from "./row-user-actions"

export const columnsUser: ColumnDef<RouterOutputs["user"]["getAllUsers"][0]>[] =
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
      accessorKey: "avatar",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Avatar" />
      ),
      cell: ({ row }) => {
        const userAvatar = row.original.imageUpdate || row.original.image
        if (userAvatar) {
          return (
            <div className="flex items-center">
              <span className="relative h-10 w-10">
                <Image
                  src={userAvatar}
                  alt="username"
                  fill
                  className="rounded-full bg-background object-cover p-1 text-muted-foreground ring-2 ring-ring ring-offset-2 ring-offset-background"
                />
              </span>
            </div>
          )
        }
        return (
          <div className="flex items-center">
            <span className="relative">
              <User
                size={40}
                className="rounded-full bg-background object-cover p-1 text-muted-foreground ring-2 ring-ring ring-offset-2 ring-offset-background"
              />
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return (
          <Badge variant="secondary" className="px-3 py-1.5">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="whitespace-nowrap capitalize">
              {row.getValue("name") ?? "pending"}
            </span>
          </Badge>
        )
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("email")}</span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        const role = row.original.role
        if (!role) return null
        return (
          <div className="flex items-center">
            <Key className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{row.getValue("role")}</span>
          </div>
        )
      },
      filterFn: (row, id, value: string) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "eventOrganizer",
      accessorFn: (row) => row.eventOrganizer?.name,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Event Organizer" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="whitespace-nowrap capitalize">
              {row.getValue("eventOrganizer")}
            </span>
          </div>
        )
      },
      filterFn: (row, id, value: string) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const {
          original: { id, eventOrganizerId, email, role },
        } = row
        return (
          <div className="relative">
            <RowUserActions
              userId={id}
              eventOrganizerId={eventOrganizerId}
              email={email}
              role={role}
            />
          </div>
        )
      },
    },
  ]
