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
import { DeleteVisitor } from "./delete-visitor"
import { UpdateVisitor } from "./update-visitor"

interface DataTableRowActionsProps {
  id: string
  title: string
  ticketStatus: Status
}

export function RowVisitorActions(props: DataTableRowActionsProps) {
  const { id, title, ticketStatus } = props

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
        <EditorOnly>
          {/* // TODO: download QR-Code */}
          {ticketStatus === "BOOKED" && (
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(id)}
              className="group hover:cursor-pointer"
            >
              <Copy className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary" />
              Copy ID
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <UpdateVisitor id={id} title={title} setOpen={setOpen} />
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <DeleteVisitor id={id} title={title} setOpen={setOpen} />
          </DropdownMenuItem>
        </EditorOnly>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
