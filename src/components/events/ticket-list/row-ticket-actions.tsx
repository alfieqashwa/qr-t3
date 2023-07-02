import type { Status } from "@prisma/client"
import { Copy, MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { EditorOnly } from "~/components/authed"
import { Button } from "~/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/ui/dropdown-menu"
import { DeleteTicket } from "./delete-ticket"

interface DataTableRowActionsProps {
  id: string
  sku: string
  status: Status
}

export function RowTicketActions({
  id,
  sku,
  status,
}: DataTableRowActionsProps) {
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
          onClick={() => navigator.clipboard.writeText(id)}
          className="hover:cursor-pointer"
        >
          <Copy className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Copy ID
        </DropdownMenuItem>
        <EditorOnly>
          <DropdownMenuSeparator />
          <DeleteTicket
            id={id}
            sku={sku}
            status={status}
            open={open}
            setOpen={setOpen}
          />
        </EditorOnly>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
