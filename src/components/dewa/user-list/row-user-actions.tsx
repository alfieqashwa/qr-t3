import { type Role } from "@prisma/client"
import { Copy, MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { Button } from "~/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/ui/dropdown-menu"
import { DeleteUser } from "./delete-user"
import { UpdateUser } from "./update-user"

interface DataTableRowActionsProps {
  userId: string
  eventOrganizerId: string | null
  email: string
  role: Role
}

export function RowUserActions(props: DataTableRowActionsProps) {
  const { userId, eventOrganizerId, email, role } = props
  const [open, setOpen] = useState(false)
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(userId)}
          className="group hover:cursor-pointer"
        >
          <Copy className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary" />
          <span className="group-hover:text-primary">Copy User ID</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {!!eventOrganizerId && (
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(eventOrganizerId)}
            className="hover:cursor-pointer"
          >
            <Copy className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Copy Event ID
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <UpdateUser id={userId} email={email} setOpen={setOpen} />
        </DropdownMenuItem>
        {role !== "DEWA" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <DeleteUser id={userId} email={email} setOpen={setOpen} />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
