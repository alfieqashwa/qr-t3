import type { Status } from "@prisma/client"
import { Loader2, Trash } from "lucide-react"
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
  title: string
  ticketStatus: Status
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function DeleteVisitor({ id, title, ticketStatus, setOpen }: Props) {
  const utils = api.useUtils()
  const { toast } = useToast()

  const { mutate, isLoading } = api.visitor.deleteEditorRole.useMutation({
    async onSuccess() {
      // delete user from team
      toast({
        title: "Succeed!",
        variant: "default",
        description: "The visitor has been deleted.",
      })
      /* auto-closed after succeed submit the dialog form */
      await wait().then(() => setOpen(false))
      await utils.visitor.getAll.invalidate()
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

  // ! Avoid editor to delete a visitor where HAS NOT AVAILABLE ticketStatus
  const disabled = ticketStatus !== "AVAILABLE"

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
              <p>
                You can&apos;t undo this changes. Click delete when you&apos;re
                sure to delete visitor
                <span className="px-1.5 font-medium uppercase text-primary">
                  {title}.
                </span>
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
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
