import { FilePlus2 } from "lucide-react"
import { useState } from "react"
import { cn } from "~/src/utils"
import { Button } from "~/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog"
import { type RouterOutputs } from "~/utils/api"
import { CreateTicketOrderForm } from "./create-ticket-order-form"

export function CreateNewTicketOrder({
  event,
  className,
}: {
  event: RouterOutputs["event"]["getByIdPublic"]
  className?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className={cn("mx-auto flex h-8 whitespace-nowrap", className)}
        >
          <FilePlus2 size={26} className="mr-2 h-4 w-4" />
          Order Ticket
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase Ticket</DialogTitle>
          <DialogDescription>
            Fill the form here. Click Order Ticket when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <CreateTicketOrderForm event={event} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}
