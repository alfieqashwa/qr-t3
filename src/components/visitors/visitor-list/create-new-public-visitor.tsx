import { FilePlus2 } from "lucide-react"
import { useState } from "react"
import { Button } from "~/ui/button"
import { CreatePublicVisitorForm } from "./create-public-visitor-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog"

export function CreateNewPublicVisitor() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="mx-auto mt-8 flex h-8 whitespace-nowrap"
        >
          <FilePlus2 size={26} className="mr-2 h-4 w-4" />
          Create Visitor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Visitor</DialogTitle>
          <DialogDescription>
            Create new visitor here. Click Create when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <CreatePublicVisitorForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}
