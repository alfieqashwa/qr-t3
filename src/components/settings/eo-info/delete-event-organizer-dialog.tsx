import { Loader2, Trash2 } from "lucide-react"
import { useRouter } from "next/router"
import { useState } from "react"
import { api } from "~/src/utils/api"
import { wait } from "~/src/utils/wait"
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

type Props = {
  id: string
}

export function DeleteEventOrganizerDialog({ id }: Props) {
  const router = useRouter()
  const utils = api.useUtils()
  const { toast } = useToast()

  const [open, setOpen] = useState(false)

  const { mutate, isLoading } = api.eo.deleteAdminRole.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your EO has been deleted.",
      })
      await utils.eo.read.invalidate()
      /* auto-closed after succeed submit the dialog form */
      await wait().then(() => setOpen(false))
      await router.push("/")
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
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="flex items-center space-x-1"
        >
          <Trash2 size={16} />
          <span>Delete</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-1/2">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription>
              You can&apos;t undo this changes. Click delete when you&apos;re
              sure to delete your Event Organizer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            {isLoading ? (
              <Button disabled size="sm" variant="destructive">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" size="sm" variant="destructive">
                Delete
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
