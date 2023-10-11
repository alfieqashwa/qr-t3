import { FilePlus2 } from "lucide-react"
import { useState } from "react"
import { Button } from "~/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog"
import { CreateTicketOrderForm } from "./create-ticket-order-form"
import { cn } from "~/src/utils"

export function CreateNewTicketOrder({
  eventOrganizerId,
  eventId,
  className,
}: {
  eventOrganizerId: string
  eventId: string
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
        <CreateTicketOrderForm
          setOpen={setOpen}
          eventOrganizerId={eventOrganizerId}
          eventId={eventId}
        />
      </DialogContent>
    </Dialog>
  )
}
