import { Loader2 } from "lucide-react"
import { useRouter } from "next/router"
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

export function DeleteTeam({ id, email }: Props) {
  const router = useRouter()
  const utils = api.useContext()
  const { toast } = useToast()

  const [open, setOpen] = useState(false)

  const { mutate, isLoading } = api.user.deleteAdminRole.useMutation({
    async onSuccess() {
      // delete user from team
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your Team has been deleted.",
      })
      await utils.user.getAllByEOIdAdminRole.invalidate()
      /* auto-closed after succeed submit the dialog form */
      await wait().then(() => setOpen(false))
      await router.replace("/settings")
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
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-1/2">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription asChild>
              <p>
                You can&apos;t undo this changes. Click delete when you&apos;re
                sure to delete
                <span className="px-1.5 font-medium text-amber-300">
                  {email}
                </span>
                from your Team.
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
