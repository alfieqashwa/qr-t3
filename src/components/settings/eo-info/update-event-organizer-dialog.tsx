import { Edit } from "lucide-react"
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
import type { RouterOutputs } from "~/utils/api"
import { UpdateEventOrganizerFrom } from "./update-event-organizer-form"

export function UpdateEventOrganizerDialog({
  eo,
}: {
  eo: RouterOutputs["eo"]["read"]
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-1"
        >
          <Edit size={16} />
          <span>Update</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-1/2">
        <DialogHeader>
          <DialogTitle>Edit Event Organizer</DialogTitle>
          <DialogDescription>
            Make changes to your event organizer here. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <UpdateEventOrganizerFrom eo={eo} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}
