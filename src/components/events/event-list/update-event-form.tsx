import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar as CalendarIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import type { SelectSingleEventHandler } from "react-day-picker"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { updateEventSchema } from "~/types/schema"
import { Button } from "~/ui/button"
import { Calendar } from "~/ui/calendar"
import { Checkbox } from "~/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel } from "~/ui/form"
import { Input } from "~/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "~/ui/popover"
import { ToastAction } from "~/ui/toast"
import { toast } from "~/ui/use-toast"
import type { RouterOutputs } from "~/utils/api"
import { api } from "~/utils/api"
import { cn } from "~/utils/index"
import { wait } from "~/utils/wait"

type Props = {
  event: RouterOutputs["event"]["getByIdAdminRole"]
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const UpdateEventForm = ({
  event,
  open,
  setOpen,
}: Props): JSX.Element => {
  const utils = api.useContext()

  const { mutate, isLoading } = api.event.updateAdminRole.useMutation({
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
    nonProfit: event?.nonProfit as boolean,
    date: event?.date as Date,
    venue: event?.venue as string,
  }

  const form = useForm<UpdateEventSchema>({
    resolver: zodResolver(updateEventSchema),
    defaultValues,
    mode: "onChange",
  })

  /* Get the hours and minutes of the current date,
   * join them and separate them with double-colon,
   * and convert to string. ("05:30")
   */
  const getHours = event?.date.getHours() as number
  const getMinutes = event?.date.getMinutes() as number
  const currentTimeValue = `${getHours.toString().padStart(2, "0")}:${getMinutes
    .toString()
    .padStart(2, "0")}`

  const [timeValue, setTimeValue] = useState<string>(currentTimeValue)

  const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const time = e.target.value
    setTimeValue(time)
  }

  function onSubmit(values: UpdateEventSchema) {
    const { id, title, nonProfit, date, venue } = values

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

    mutate({
      id,
      title,
      venue,
      nonProfit,
      date: newSelectedDate,
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
        {/* non-ptovit */}
        <FormField
          control={form.control}
          name="nonProfit"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  //? ISSUES -> https://github.com/shadcn-ui/ui/issues/657#issuecomment-1633006421
                  onCheckedChange={() => field.onChange(!field.value)}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>A Non Profit Event?</FormLabel>
              </div>
            </FormItem>
          )}
        />
        {/* Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="grid grid-cols-6 items-center gap-4">
              <FormLabel className="mt-2 text-right">Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[320px] pl-3 text-left font-normal",
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
                <PopoverContent className="p-2" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange as SelectSingleEventHandler} // fix the undefined type
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    footer={
                      <div className="mt-4 text-sm">
                        <p className="font-bold">Pick a time:</p>
                        <Input
                          className="mt-1 text-primary-foreground"
                          type="time"
                          value={timeValue}
                          onChange={handleTimeChange}
                        />
                      </div>
                    }
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
