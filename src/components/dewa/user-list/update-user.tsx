import { Pen } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog"
import { UpdateUserForm } from "./update-user-form"
import { api } from "~/src/utils/api"

type Props = {
  id: string
  email: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function UpdateUser({ id, email, setOpen }: Props) {
  const user = api.user.getByIdDewaRole.useQuery({ id }, { enabled: !!id })

  return (
    <Dialog>
      <DialogTrigger className="group flex w-full items-center">
        <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary" />
        <span className="group-hover:text-primary">Edit</span>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
          <DialogDescription asChild>
            <p>
              Edit
              <span className="px-1.5 font-medium text-amber-300">{email}</span>
              of your user here. Click Update when you&apos;re done.
            </p>
          </DialogDescription>
        </DialogHeader>
        {user.status === "success" && (
          <UpdateUserForm user={user.data} setOpen={setOpen} />
        )}
      </DialogContent>
    </Dialog>
  )
}
