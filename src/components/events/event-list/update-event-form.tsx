import { format } from "date-fns"
import { cn } from "~/utils/index"
import type { z } from "zod"
import { Loader2, Calendar as CalendarIcon } from "lucide-react"
import { updateEventSchema } from "~/src/types/schema"
import { Button } from "~/ui/button"
import { Input } from "~/ui/input"
import { ToastAction } from "~/ui/toast"
import { toast } from "~/ui/use-toast"
import type { RouterOutputs } from "~/utils/api"
import { api } from "~/utils/api"
import { wait } from "~/utils/wait"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel } from "~/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { Calendar } from "../../ui/calendar"
import type { SelectSingleEventHandler } from "react-day-picker"

type Props = {
  event: RouterOutputs["event"]["getById"]
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const UpdateEventForm = ({
  event,
  open,
  setOpen,
}: Props): JSX.Element => {
  const utils = api.useContext()

  const { mutate, isLoading } = api.event.update.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your new team has been updated.",
      })
      await utils.event.getAll.invalidate()
      /* auto-closed after succeed submit the dialog form */
      await wait().then(() => setOpen(!open))
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

  type UpdateEventSchema = z.infer<typeof updateEventSchema>

  const defaultValues: UpdateEventSchema = {
    id: event?.id as string,
    title: event?.title as string,
    date: event?.date as Date,
    venue: event?.venue as string,
  }

  const form = useForm<UpdateEventSchema>({
    resolver: zodResolver(updateEventSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(values: UpdateEventSchema) {
    const { id, title, date, venue } = values

    mutate({
      id,
      title,
      venue,
      date,
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
        className="grid gap-4"
      >
        {/* title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="grid grid-cols-6 items-center gap-x-4">
              <FormLabel className="mt-2 text-right">Title</FormLabel>
              <FormControl>
                <Input {...field} className="col-span-3 w-[240px] capitalize" />
              </FormControl>
            </FormItem>
          )}
        />
        {/* venue*/}
        <FormField
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem className="grid grid-cols-6 items-center gap-x-4">
              <FormLabel className="mt-2 text-right">Venue</FormLabel>
              <FormControl>
                <Input {...field} className="col-span-3 w-[240px] capitalize" />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4">
              <FormLabel className="mt-2 text-right">Date</FormLabel>
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
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-2" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange as SelectSingleEventHandler} // fix the undefined type
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        <div className="mt-4 flex flex-row items-center justify-end space-x-2">
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
        </div>
      </form>
    </Form>
  )
}
