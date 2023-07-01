import { Loader2, Pen } from "lucide-react";
import { useState } from "react";
import { Button } from "~/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog";
import { Input } from "~/ui/input";
import { Label } from "~/ui/label";
import { ToastAction } from "~/ui/toast";
import { useToast } from "~/ui/use-toast";
import { api } from "~/utils/api";
import { wait } from "~/utils/wait";
import { DatePicker } from "./date-picker";

type Props = {
  id: string;
  title: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function UpdateEvent({ id, title, open, setOpen }: Props) {
  const utils = api.useContext();
  const { toast } = useToast();

  const { data: event } = api.event.getById.useQuery({ id }, { enabled: !!id });
  const [currentDate, setCurrentDate] = useState<Date | undefined>(event?.date);

  const { mutate, isLoading, error } = api.event.update.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your new team has been updated.",
      });
      await utils.event.getAll.invalidate();
      /* auto-closed after succeed submit the dialog form */
      await wait().then(() => setOpen(!open));
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
    const venue = formData.get("venue") as string;

    mutate({
      id,
      title,
      venue,
      date: currentDate as Date,
    });
  };

  return (
    <Dialog>
      <DialogTrigger className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
        <Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
        Edit
      </DialogTrigger>

      <DialogContent className="sm:max-w-1/2">
        <DialogHeader>
          <DialogTitle>Update Event</DialogTitle>
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
          {/* venue*/}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Venue</Label>
            <Input
              id="venue"
              name="venue"
              defaultValue={event?.venue}
              className="capitalize"
            />
            {error?.data?.zodError?.fieldErrors.venue && (
              <span className="text-xs text-destructive">
                {error.data.zodError.fieldErrors.venue}
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
              onClick={() => setOpen(!open)}
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
