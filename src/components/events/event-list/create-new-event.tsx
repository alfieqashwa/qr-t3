import { FilePlus2 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog";
import { EventForm } from "./event-form";

export function AddNewEvent() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <FilePlus2 size={26} className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Create new event here. Click Add Event when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <EventForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
