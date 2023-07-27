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
import { UpdateVisitorForm } from "./update-visitor-form"
// import { UpdateEventForm } from "./update-event-form"

type Props = {
  id: string
  title: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function UpdateVisitor({ id, title, setOpen }: Props) {
  const { data: visitor, status: visitorStatus } = api.visitor.getById.useQuery(
    { id },
    { enabled: !!id }
  )

  return (
    <Dialog>
      <DialogTrigger className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
        <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
        Edit
      </DialogTrigger>

      <DialogContent className="sm:max-w-1/2">
        <DialogHeader>
          <DialogTitle>Update Visitor</DialogTitle>
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
        {visitorStatus === "success" && !!visitor && (
          <UpdateVisitorForm visitor={visitor} setOpen={setOpen} />
        )}
      </DialogContent>
    </Dialog>
  )
}
