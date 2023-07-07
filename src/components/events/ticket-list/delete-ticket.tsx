import type { Status } from "@prisma/client"
import { Loader2, Trash } from "lucide-react"
import type { SetStateAction } from "react"
import { Button } from "~/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog"
import { ToastAction } from "~/ui/toast"
import { useToast } from "~/ui/use-toast"
import { api } from "~/utils/api"
import { wait } from "~/utils/wait"

type Props = {
  id: string
  status: Status
  open: boolean
  setOpen: React.Dispatch<SetStateAction<boolean>>
}

export function DeleteTicket({ id, status, open, setOpen }: Props) {
  const utils = api.useContext()
  const { toast } = useToast()

  const { mutate, isLoading } = api.ticket.delete.useMutation({
    async onSuccess() {
      // delete user from team
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your ticket has been deleted.",
      })
      await utils.ticket.getAll.invalidate()
      /* auto-closed after succeed submit the dialog form */
      await wait().then(() => setOpen(!open))
    },
    onError() {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate({
      id,
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start rounded-sm border-none px-2 py-0 text-sm font-normal outline-none transition-colors focus:bg-accent focus:text-accent-foreground"
          disabled={status !== "AVAILABLE"}
        >
          <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-1/2">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription asChild>
              <p className="">
                You can&apos;t undo this changes. Click delete when you&apos;re
                sure to delete ticket
                <span className="px-1.5 font-medium uppercase text-amber-300">
                  {id}
                </span>
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(!open)}
            >
              Cancel
            </Button>
            {isLoading ? (
              <Button disabled variant="destructive" size="sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" variant="destructive" size="sm">
                Delete
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
