import { Pen } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog"
import { api } from "~/utils/api"
import { UpdateEventForm } from "./update-event-form"

type Props = {
  id: string
  title: string
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function UpdateEvent({ id, title, open, setOpen }: Props) {
  const { data: event, status: eventStatus } =
    api.event.getByIdAdminRole.useQuery({ id }, { enabled: !!id })

  return (
    <Dialog>
      <DialogTrigger className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
        <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
        Edit
      </DialogTrigger>

      <DialogContent className="sm:max-w-1/2">
        <DialogHeader>
          <DialogTitle>Update Event</DialogTitle>
          <DialogDescription asChild>
            <p>
              Edit
              <span className="px-1.5 font-medium uppercase text-amber-300">
                {title}
              </span>
              of your event here. Click Update when you&apos;re done.
            </p>
          </DialogDescription>
        </DialogHeader>
        {eventStatus === "success" && !!event && (
          <UpdateEventForm event={event} open={open} setOpen={setOpen} />
        )}
      </DialogContent>
    </Dialog>
  )
}
