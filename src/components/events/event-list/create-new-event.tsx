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
import { useSession } from "next-auth/react"

export function CreateNewEvent() {
  const [open, setOpen] = useState(false)

  const session = useSession()

  const disabled =
    session.data?.user.role === "ADMIN" || session.data?.user.role === "DEWA"

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {session.status === "authenticated" && (
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={!disabled}
            className="ml-2 h-8 whitespace-nowrap"
          >
            <FilePlus2 className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </SheetTrigger>
      )}
      <SheetContent className="bg-card">
        <SheetHeader>
          <SheetTitle>Add New Event</SheetTitle>
          <SheetDescription>
            Click Add Event when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <CreateEventForm setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  )
}
