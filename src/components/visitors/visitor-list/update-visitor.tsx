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

type Props = {
  id: string
  title: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function UpdateVisitor({ id, title, setOpen }: Props) {
  const visitor = api.visitor.getById.useQuery({ id }, { enabled: !!id })

  return (
    <Dialog>
      <DialogTrigger className="group flex w-full items-center">
        <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary" />
        <span className="group-hover:text-primary">Edit</span>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>Update Visitor</DialogTitle>
          <DialogDescription asChild>
            <p>
              Edit
              <span className="px-1.5 font-medium uppercase text-primary">
                {title}
              </span>
              of your event here. Click Update when you&apos;re done.
            </p>
          </DialogDescription>
        </DialogHeader>
        {visitor.status === "success" && !!visitor && (
          <UpdateVisitorForm visitor={visitor.data} setOpen={setOpen} />
        )}
      </DialogContent>
    </Dialog>
  )
}
