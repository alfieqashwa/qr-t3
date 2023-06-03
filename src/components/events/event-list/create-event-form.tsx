import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import { UploadButton } from "@uploadthing/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { DEFAULT_THUMBNAIL } from "~/constants/thumbnail";
import type { OurFileRouter } from "~/server/uploadthing/router";
import { cn } from "~/src/utils";
import { createEventSchema } from "~/types/schema";
import { Button } from "~/ui/button";
import { Calendar } from "~/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/ui/form";
import { Input } from "~/ui/input";
import { Label } from "~/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "~/ui/popover";
import { ToastAction } from "~/ui/toast";
import { useToast } from "~/ui/use-toast";
import { api } from "~/utils/api";
import { wait } from "~/utils/wait";

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function CreateEventForm(props: Props) {
  const [thumbnail, setThumbnail] = useState<string | null>();
  const utils = api.useContext();
  const { toast } = useToast();

  const createEvent = api.event.create.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your form has been created.",
      });
      await utils.event.count.invalidate();
      await utils.event.getAll.invalidate();
      await wait().then(() => props.setOpen(false));
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

  const form = useForm<z.infer<typeof createEventSchema>>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      venue: "",
      thumbnail: DEFAULT_THUMBNAIL,
      date: new Date(),
    },
  });

  function onSubmit(values: z.infer<typeof createEventSchema>) {
    const { title, venue, date } = values;
    createEvent.mutate({
      title,
      venue,
      date,
      thumbnail: thumbnail ?? DEFAULT_THUMBNAIL,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event</FormLabel>
              <FormControl>
                <Input placeholder="title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue</FormLabel>
              <FormControl>
                <Input placeholder="venue" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Event</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPPP", { locale: id })
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of event is used to calculate the due date.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
          {createEvent.error?.data?.zodError?.fieldErrors.thumbnail && (
            <span className="text-xs text-destructive">
              {createEvent.error?.data?.zodError?.fieldErrors.thumbnail}
            </span>
          )}
        </div>
        {createEvent.isLoading ? (
          <Button disabled size="sm">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" size="sm">
            Create Event
          </Button>
        )}
      </form>
    </Form>
  );
}
