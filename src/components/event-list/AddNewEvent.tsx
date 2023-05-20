import { format } from "date-fns";
import { Calendar as CalendarIcon, FilePlus2, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/src/utils";
import { api } from "~/src/utils/api";
import { wait } from "~/src/utils/wait";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/text-area";
import { ToastAction } from "../ui/toast";
import { toast } from "../ui/use-toast";
import { useSession } from "next-auth/react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "~/src/server/uploadthing/router";

export function AddNewEvent() {
  const [date, setDate] = useState<Date>();
  const [upload, setUpload] = useState<string>();
  const [open, setOpen] = useState(false);
  const session = useSession();

  const utils = api.useContext();
  const { mutate, isLoading, error } = api.event.create.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your form has been created.",
      });
      await utils.event.getAll.invalidate();
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
    const title = formData.get("title")?.toString().toLowerCase() as string;
    const location = formData
      .get("location")
      ?.toString()
      .toLowerCase() as string;
    const description = formData
      .get("description")
      ?.toString()
      .toLowerCase() as string;
    const thumbnail = upload as string;
    //validator
    if (session.status !== "authenticated") return null;
    const eventOrganizerId = session.data.user.eventOrganizerId as string;

    mutate({
      title,
      location,
      date: date as Date,
      description,
      thumbnail,
      eventOrganizerId,
    });
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
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Title */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" className="capitalize" />
            {error?.data?.zodError?.fieldErrors.title && (
              <span className="text-xs text-destructive">
                {error?.data?.zodError?.fieldErrors.title}
              </span>
            )}
          </div>
          {/* Location */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" className="capitalize" />
            {error?.data?.zodError?.fieldErrors.location && (
              <span className="text-xs text-destructive">
                {error?.data?.zodError?.fieldErrors.location}
              </span>
            )}
          </div>
          {/* Date */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="date">Date</Label>
            <DatePicker date={date as Date} setDate={setDate} />
            {error?.data?.zodError?.fieldErrors.date && (
              <span className="text-xs text-destructive">
                {error?.data?.zodError?.fieldErrors.date}
              </span>
            )}
          </div>
          {/* Description */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Type your description here."
            />
            {error?.data?.zodError?.fieldErrors.description && (
              <span className="text-xs text-destructive">
                {error?.data?.zodError?.fieldErrors.description}
              </span>
            )}
          </div>
          {/* Thumbnail */}
          <div className="flex flex-col items-start space-y-1.5">
            <Label htmlFor="thumbnail">Thumbnail</Label>
            <div className="whitespace-nowrap hover:cursor-pointer">
              <UploadButton<OurFileRouter>
                endpoint="withMdwr"
                onClientUploadComplete={(res) => {
                  // Do something with the response
                  setUpload(res?.[0]?.fileUrl as string);
                }}
                onUploadError={(error: Error) => {
                  console.error(`ERROR! ${error.message}`);
                }}
              />
            </div>
            {error?.data?.zodError?.fieldErrors.thumbnail && (
              <span className="text-xs text-destructive">
                {error?.data?.zodError?.fieldErrors.thumbnail}
              </span>
            )}
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

type DatePickerProps = {
  date?: Date;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
};

function DatePicker({ date, setDate }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
