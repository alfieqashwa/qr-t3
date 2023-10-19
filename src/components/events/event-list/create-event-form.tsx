import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import type { SelectSingleEventHandler } from "react-day-picker"
import { useForm } from "react-hook-form"
import type * as z from "zod"
import { cn } from "~/src/utils"
import { createEventSchema } from "~/types/schema"
import { Button } from "~/ui/button"
import { Calendar } from "~/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/ui/form"
import { Input } from "~/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "~/ui/popover"
import { SheetFooter } from "~/ui/sheet"
import { Switch } from "~/ui/switch"
import { ToastAction } from "~/ui/toast"
import { useToast } from "~/ui/use-toast"
import { api } from "~/utils/api"
import { wait } from "~/utils/wait"

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function CreateEventForm(props: Props) {
  const utils = api.useContext()
  const { toast } = useToast()

  const createEvent = api.event.createAdminRole.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your form has been created.",
      })
      await utils.event.count.invalidate()
      await utils.event.getAll.invalidate()
      await utils.event.eventData.invalidate()
      await wait().then(() => props.setOpen(false))
    },
    onError() {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    },
  })

  const form = useForm<z.infer<typeof createEventSchema>>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
      venue: "",
      date: new Date(),
      profit: true,
    },
  })

  const [timeValue, setTimeValue] = useState<string>("00:00")

  const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const time = e.target.value
    setTimeValue(time)
  }

  function onSubmit(values: z.infer<typeof createEventSchema>) {
    const { title, venue, profit, date } = values
    //github.com/shadcn-ui/ui/issues/657#issuecomment-1633006421
    /**
     * Source: https://react-day-picker.js.org/guides/input-fields
     */
    const [hours, minutes] = timeValue
      .split(":")
      .map((str) => parseInt(str, 10))

    const newSelectedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes
    )

    createEvent.mutate({
      title,
      venue,
      profit,
      date: newSelectedDate,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event</FormLabel>
              <FormControl>
                <Input placeholder="title" {...field} className="capitalize" />
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
                <Input placeholder="venue" {...field} className="capitalize" />
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
                      variant="outline"
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        <p>
                          <span>
                            {format(field.value, "PPPP", { locale: id })}
                          </span>
                          <span className="px-1">Pukul</span>
                          <span>{timeValue}</span>
                        </p>
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
                    onSelect={field.onChange as SelectSingleEventHandler}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    footer={
                      <div className="mt-4 text-sm">
                        <p className="font-bold">Pick a time:</p>
                        <Input
                          className="mt-1"
                          type="time"
                          value={timeValue}
                          onChange={handleTimeChange}
                        />
                      </div>
                    }
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
        {/* provit */}
        <FormField
          control={form.control}
          name="profit"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Provit?</FormLabel>
                <FormDescription>
                  <span>Switch to left if this a non-profit event.</span>
                  <span>e.g: wedding, party, etc</span>
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <SheetFooter className="absolute bottom-8 left-0 right-0 px-6">
          <Button
            className="mt-2 sm:mt-0"
            type="button"
            variant="outline"
            size="sm"
            onClick={() => props.setOpen(false)}
          >
            Cancel
          </Button>
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
        </SheetFooter>
      </form>
    </Form>
  )
}
