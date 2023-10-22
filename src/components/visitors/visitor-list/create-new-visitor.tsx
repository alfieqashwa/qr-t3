import { FilePlus2 } from "lucide-react"
import { useState } from "react"
import { Button } from "~/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/ui/sheet"
import { CreateVisitorForm } from "./create-visitor-form"

export function CreateNewVisitor() {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-2 flex h-8 whitespace-nowrap"
        >
          <FilePlus2 className="mr-2 h-4 w-4" />
          Create Visitor
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-card">
        <SheetHeader>
          <SheetTitle>Add New Visitor</SheetTitle>
          <SheetDescription>
            Create new visitor here. Click Create when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <CreateVisitorForm setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  )
}
