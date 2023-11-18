import type { Status } from "@prisma/client"
import { Loader2, Trash } from "lucide-react"
import type { SetStateAction } from "react"
import { cn } from "~/src/utils"
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
  const utils = api.useUtils()
  const { toast } = useToast()

  const { mutate, isLoading } = api.ticket.deleteEditorRole.useMutation({
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

  const disabled = status !== "AVAILABLE"

  return (
    <Dialog>
      <DialogTrigger
        disabled={disabled}
        className="group flex w-full items-center disabled:cursor-not-allowed"
      >
        <Trash
          className={cn(
            "mr-2 h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary",
            disabled && "group-hover:text-muted-foreground/70",
          )}
        />
        <span
          className={cn(
            "group-hover:text-primary",
            disabled &&
              "text-muted-foreground/70 group-hover:text-muted-foreground",
          )}
        >
          Delete
        </span>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription asChild>
              <p className="">
                You can&apos;t undo this changes. Click delete when you&apos;re
                sure to delete ticket
                <span className="px-1.5 font-medium uppercase text-primary">
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
              <Button
                //! double validation
                disabled={disabled}
                type="submit"
                variant="destructive"
                size="sm"
              >
                Delete
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
