import { FilePlus2 } from "lucide-react"
import { useState } from "react"
import { Button } from "~/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/ui/sheet"
import { CreateEventForm } from "./create-event-form"

export function CreateNewEvent() {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="whitespace-nowrap">
          <FilePlus2 size={26} className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </SheetTrigger>
      <SheetContent position="right" size="content">
        <SheetHeader>
          <SheetTitle>Add New Event</SheetTitle>
          <SheetDescription>
            Create new event here. Click Add Event when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <CreateEventForm setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  )
}
