import { Loader2, Trash } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Button } from "~/ui/button"
import { ToastAction } from "~/ui/toast"
import { useToast } from "~/ui/use-toast"
import { api } from "~/utils/api"
import { wait } from "~/utils/wait"

type Props = {
  id: string
  email: string
}

export function DeleteUser({ id, email }: Props) {
  const utils = api.useUtils()
  const { toast } = useToast()

  const [open, setOpen] = useState(false)

  const { mutate, isLoading } = api.user.deleteAdminRole.useMutation({
    async onSuccess() {
      // delete user from team
      toast({
        title: "Succeed!",
        variant: "default",
        description: "The user has been deleted.",
      })
      await utils.user.getAllUsers.invalidate()
      /* auto-closed after succeed submit the dialog form */
      await wait().then(() => setOpen(false))
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="group flex w-full items-center">
        <Trash className="mr-2 h-3.5 w-3.5 text-muted-foreground/70 group-hover:text-primary" />
        <span className="group-hover:text-primary">Delete</span>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription asChild>
              <p>
                You can&apos;t undo this changes. Click delete when you&apos;re
                sure to delete
                <span className="px-1.5 font-medium text-primary">{email}</span>
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
