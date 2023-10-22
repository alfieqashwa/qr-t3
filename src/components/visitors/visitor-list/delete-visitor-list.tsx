import type { Table } from "@tanstack/react-table"
import { Loader2 } from "lucide-react"
import { useState } from "react"
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
import type { RouterOutputs } from "~/utils/api"
import { api } from "~/utils/api"
import { wait } from "~/utils/wait"

interface DeleteVisitorListProps<TData> {
  table: Table<TData>
}
export function DeleteVisitorList<TData>({
  table,
}: DeleteVisitorListProps<TData>) {
  const utils = api.useUtils()
  const { toast } = useToast()

  const [open, setOpen] = useState(false)

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original) as RouterOutputs["visitor"]["getAll"]

  const ids = selectedRows.map((row) => ({
    id: row.id,
  }))

  const { mutate, isLoading } = api.visitor.deleteSelectedAdminRole.useMutation(
    {
      async onSuccess() {
        toast({
          title: "Succeed!",
          variant: "default",
          description: "All selected visitors have been deleted.",
        })
        await utils.visitor.getAll.invalidate()
        table.resetRowSelection() // reset row selection after succeed
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
    }
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate(ids)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="ml-2 h-8 whitespace-nowrap"
        >
          Delete Selected ({table.getFilteredSelectedRowModel().rows.length})
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription asChild>
              <p>
                You can&apos;t undo this changes. Click delete when you&apos;re
                sure to delete the selected visitor(s).
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
