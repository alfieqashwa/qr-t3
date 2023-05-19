import { FilePlus2, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";

export function AddNewEvent() {
  const [open, setOpen] = useState(false);
  const isLoading = false;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <FilePlus2
          size={26}
          className="text-amber-200 transition-colors duration-200 ease-in-out hover:cursor-pointer hover:text-amber-300"
        />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Create new event here. Click Add Event when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Title</Label>
            <Input id="title" name="title" />
            {/* {error?.data?.zodError?.fieldErrors.email && (
              <span className="text-xs text-destructive">
                {error?.data?.zodError?.fieldErrors.email}
              </span>
            )} */}
          </div>
          {/* Location */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Location</Label>
            <Input id="location" name="location" />
            {/* {error?.data?.zodError?.fieldErrors.email && (
              <span className="text-xs text-destructive">
                {error?.data?.zodError?.fieldErrors.email}
              </span>
            )} */}
          </div>
          <DialogFooter>
            <Button
              className="flex flex-row items-center justify-end space-x-2"
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            {isLoading ? (
              <Button disabled size="sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" size="sm">
                Add Event
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
