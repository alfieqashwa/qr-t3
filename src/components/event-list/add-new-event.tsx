import { UploadButton } from "@uploadthing/react";
import { FilePlus2, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import type { OurFileRouter } from "~/src/server/uploadthing/router";
import { api } from "~/src/utils/api";
import { wait } from "~/src/utils/wait";
import { Button } from "../ui/button";
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
import { ToastAction } from "../ui/toast";
import { toast } from "../ui/use-toast";
import { DatePicker } from "./date-picker";

export function AddNewEvent() {
  const [date, setDate] = useState<Date>();
  const [thumbnail, setThumbnail] = useState<string>();
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
    const venue = formData.get("venue")?.toString().toLowerCase() as string;

    //validator
    if (session.status !== "authenticated") return null;
    const eventOrganizerId = session.data.user.eventOrganizerId as string;

    mutate({
      title,
      venue,
      date: date as Date,
      thumbnail: thumbnail as string,
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
          {/* Venue */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="venue">Venue</Label>
            <Input id="venue" name="venue" className="capitalize" />
            {error?.data?.zodError?.fieldErrors.venue && (
              <span className="text-xs text-destructive">
                {error?.data?.zodError?.fieldErrors.venue}
              </span>
            )}
          </div>
          {/* Date */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="date">Date</Label>
            <DatePicker date={date} setDate={setDate} />
            {error?.data?.zodError?.fieldErrors.date && (
              <span className="text-xs text-destructive">
                {error?.data?.zodError?.fieldErrors.date}
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
                  setThumbnail(res?.[0]?.fileUrl as string);
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
