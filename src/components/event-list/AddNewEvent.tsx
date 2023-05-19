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
import { api } from "~/src/utils/api";
import { toast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";

export function AddNewEvent() {
  const [open, setOpen] = useState(false);

  const utils = api.useContext();
  const { mutate, isLoading, error } = api.event.create.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your form has been created.",
      });
      await utils.event.getAll.invalidate();
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
    const date = formData.get("date") as string;
    const description = formData
      .get("description")
      ?.toString()
      .toLowerCase() as string;
    const thumbnail = formData.get("thumbnail") as string;

    mutate({
      title,
      location,
      date,
      description,
      thumbnail,
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
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" />
            {error?.data?.zodError?.fieldErrors.title && (
              <span className="text-xs text-destructive">
                {error?.data?.zodError?.fieldErrors.title}
              </span>
            )}
          </div>
          {/* Location */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" />
            {error?.data?.zodError?.fieldErrors.location && (
              <span className="text-xs text-destructive">
                {error?.data?.zodError?.fieldErrors.location}
              </span>
            )}
          </div>
          {/* Date */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" />
            {error?.data?.zodError?.fieldErrors.date && (
              <span className="text-xs text-destructive">
                {error?.data?.zodError?.fieldErrors.date}
              </span>
            )}
          </div>
          {/* Description */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" />
            {error?.data?.zodError?.fieldErrors.description && (
              <span className="text-xs text-destructive">
                {error?.data?.zodError?.fieldErrors.description}
              </span>
            )}
          </div>
          {/* Thumbnail */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="thumbnail">Thumbnail</Label>
            <Input id="thumbnail" name="thumbnail" />
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

/*
title,
thumbnail,
location,
date,
description
*/
