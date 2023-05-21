import { Role } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { ToastAction } from "~/components/ui/toast";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/src/utils/api";

type Props = {
  id: string;
  title: string;
  location: string;
  date: Date;
};

export function UpdateEvent({ id, title, location, date }: Props) {
  const utils = api.useContext();
  const { toast } = useToast();

  const [currentDate, setCurrentDate] = useState<Date | undefined>(date);
  const [open, setOpen] = useState(false);

  const { mutate, isLoading, error } = api.event.update.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your new team has been updated.",
      });
      await utils.event.getAll.invalidate();
      /* auto-closed after succeed submit the dialog form */
      await wait().then(() => setOpen(false));
    },
    onError() {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const location = formData.get("location") as string;

    mutate({
      id,
      title,
      location,
      date: currentDate as Date,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="whitespace-nowrap">
          Edit Role
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-1/2">
        <DialogHeader>
          <DialogTitle>Update Team</DialogTitle>
          <DialogDescription asChild>
            <p>
              Edit
              <span className="px-1.5 font-medium uppercase text-amber-300">
                {title}
              </span>
              of your event here. Click Update when you&apos;re done.
            </p>
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-3" onSubmit={handleSubmit}>
          {/* title */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={title}
              className="capitalize"
            />
            {error?.data?.zodError?.fieldErrors.title && (
              <span className="text-xs text-destructive">
                {error.data.zodError.fieldErrors.title}
              </span>
            )}
          </div>
          {/* location */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Location</Label>
            <Input
              id="location"
              name="location"
              defaultValue={location}
              className="capitalize"
            />
            {error?.data?.zodError?.fieldErrors.location && (
              <span className="text-xs text-destructive">
                {error.data.zodError.fieldErrors.location}
              </span>
            )}
          </div>
          {/* Date */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="date">Date</Label>
            {currentDate && (
              <DatePicker date={currentDate} setDate={setCurrentDate} />
            )}
            {error?.data?.zodError?.fieldErrors.date && (
              <span className="text-xs text-destructive">
                {error?.data?.zodError?.fieldErrors.date}
              </span>
            )}
          </div>
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
              <Button disabled size="sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" size="sm">
                Update
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { wait } from "~/src/utils/wait";
import { Input } from "../ui/input";
import { DatePicker } from "./DatePicker";
import { useSession } from "next-auth/react";

export function SelectRole({ role }: { role: Role }) {
  return (
    <Select name="role" defaultValue={role}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Role</SelectLabel>
          <SelectItem value={Role.EDITOR}>{Role.EDITOR}</SelectItem>
          <SelectItem value={Role.OPERATOR}>{Role.OPERATOR}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
