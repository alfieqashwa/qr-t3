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
  const { data: event, status } = api.event.getByIdAdminRole.useQuery(
    { id },
    { enabled: !!id },
  )

  return (
    <Dialog>
      <DialogTrigger className="group flex w-full items-center py-1 pl-2">
        <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary" />
        <span className="group-hover:text-primary">Edit</span>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>Update Event</DialogTitle>
          <DialogDescription asChild>
            <p>
              Edit
              <span className="px-1.5 font-medium uppercase text-primary">
                {title}
              </span>
              event here. Click Update when you&apos;re done.
            </p>
          </DialogDescription>
        </DialogHeader>
        {status === "success" && !!event && (
          <UpdateEventForm event={event} open={open} setOpen={setOpen} />
        )}
      </DialogContent>
    </Dialog>
  )
}
