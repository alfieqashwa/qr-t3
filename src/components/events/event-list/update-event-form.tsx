import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Calendar as CalendarIcon, Loader2 } from "lucide-react"
import React, { useState } from "react"
import type { SelectSingleEventHandler } from "react-day-picker"
import { useFieldArray, useForm, type UseFormReturn } from "react-hook-form"
import type { z } from "zod"
import { extendUpdateEventSchema } from "~/types/schema"
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
import { ScrollArea } from "~/ui/scroll-area"
import { Separator } from "~/ui/separator"
import { Switch } from "~/ui/switch"
import { ToastAction } from "~/ui/toast"
import { toast } from "~/ui/use-toast"
import type { RouterOutputs } from "~/utils/api"
import { api } from "~/utils/api"
import { formattedInputPriceValue } from "~/utils/formattedPrice"
import { cn } from "~/utils/index"
import { wait } from "~/utils/wait"

type Props = {
  event: RouterOutputs["event"]["getByIdAdminRole"]
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function UpdateEventForm({ event, open, setOpen }: Props): JSX.Element {
  const [step, setStep] = useState<1 | 2>(1)

  const utils = api.useUtils()

  // Queries
  const { data: hasTickets } = api.ticket.getAllByEventId.useQuery(
    { eventId: event?.id as string },
    {
      enabled: !!event?.id,
      select: (tickets) => tickets.length > 0,
    },
  )

  // Mutations
  const { mutate, isLoading } = api.event.updateAdminRole.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your form has been updated.",
      })
      await utils.event.getAll.invalidate()
      await utils.event.count.invalidate()
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

  type UpdateEventSchema = z.infer<typeof extendUpdateEventSchema>

  const categories = event?.categories.map((c) => ({
    id: c.id,
    name: c.name,
    price: c.price.toString(), // convert to String
    eventId: c.eventId,
  }))

  const form = useForm<UpdateEventSchema>({
    resolver: zodResolver(extendUpdateEventSchema),
    defaultValues: {
      id: event?.id as string,
      title: event?.title as string,
      profit: event?.profit as boolean,
      date: event?.date as Date,
      venue: event?.venue as string,
      categories,
    },
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
    const { id, title, profit, date, venue, categories: _categories } = values

    const initialPrice = 0.0 // for a non-profit value
    const categories = _categories.map((c) => ({
      id: c.id,
      name: c.name.toLowerCase(),
      price:
        c.price === "" ? initialPrice : parseFloat(c.price.replace(/,/g, "")),
    }))

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
      minutes,
    )

    mutate({
      id,
      title,
      venue,
      profit,
      date: newSelectedDate,
      categories,
    })
  }

  const disabledNextBtn =
    form.watch("title").length < 5 || form.watch("venue").length < 3
  const disabledUpdateBtn =
    disabledNextBtn || form.watch("categories").some((c) => c.name === "")

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
        className="grid gap-4"
      >
        {step === 1 && (
          <StepOneForm
            form={form}
            timeValue={timeValue}
            handleTimeChange={handleTimeChange}
            hasTickets={hasTickets}
            setOpen={setOpen}
            setStep={setStep}
            disabledNextBtn={disabledNextBtn}
          />
        )}
        {step === 2 && (
          <StepTwoForm
            form={form}
            setStep={setStep}
            isLoading={isLoading}
            disabledUpdateBtn={disabledUpdateBtn}
          />
        )}
      </form>
    </Form>
  )
}

type StepOneFormProps = {
  form: UseFormReturn<z.infer<typeof extendUpdateEventSchema>>
  hasTickets: boolean | undefined
  timeValue: string
  handleTimeChange: React.ChangeEventHandler<HTMLInputElement>
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>
  disabledNextBtn: boolean
}

const StepOneForm = ({
  form,
  hasTickets,
  timeValue,
  handleTimeChange,
  setOpen,
  setStep,
  disabledNextBtn,
}: StepOneFormProps) => {
  return (
    <>
      {/* title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 items-center gap-x-4 sm:grid-cols-6">
            <FormLabel className="mt-2 sm:text-right">Title</FormLabel>
            <FormControl>
              <Input
                {...field}
                className="w-[280px] capitalize sm:col-span-3"
              />
            </FormControl>
            <FormMessage className="sm:col-span-5 sm:text-center" />
          </FormItem>
        )}
      />
      {/* venue*/}
      <FormField
        control={form.control}
        name="venue"
        render={({ field }) => (
          <FormItem className="grid grid-cols-1 items-center gap-x-4 sm:grid-cols-6">
            <FormLabel className="mt-2 sm:text-right">Venue</FormLabel>
            <FormControl>
              <Input
                {...field}
                className="w-[280px] capitalize sm:col-span-3"
              />
            </FormControl>
            <FormMessage className="sm:col-span-5 sm:text-center" />
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
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value ? (
                      <p>
                        <span>
                          {!!field.value &&
                            format(field.value, "PPPP", { locale: id })}
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
      {/* provit */}
      <FormField
        control={form.control}
        name="profit"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel className="text-amber-300">
                {field.value ? "Provit" : "Non-provit"}
              </FormLabel>
              {hasTickets ? (
                <FormDescription>
                  Cannot update because this event has already created the
                  tickets
                </FormDescription>
              ) : (
                <FormDescription>
                  Switch to left to create a non-profit event (e.g: wedding,
                  party, etc).
                </FormDescription>
              )}
            </div>
            <FormControl>
              <Switch
                disabled={hasTickets}
                checked={field.value}
                onCheckedChange={field.onChange}
                className="ml-8"
              />
            </FormControl>
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
        <Button
          disabled={disabledNextBtn}
          type="button"
          size="sm"
          onClick={() => setStep(2)}
        >
          Next Step
        </Button>
      </div>
    </>
  )
}

type StepTwoFormProps = {
  form: UseFormReturn<z.infer<typeof extendUpdateEventSchema>>
  setStep: React.Dispatch<React.SetStateAction<1 | 2>>
  isLoading: boolean
  disabledUpdateBtn: boolean
}

const StepTwoForm = ({
  form,
  setStep,
  isLoading,
  disabledUpdateBtn,
}: StepTwoFormProps) => {
  const { fields } = useFieldArray({
    name: "categories",
    control: form.control,
  })

  return (
    <>
      <ScrollArea className="max-h-[32rem] overflow-y-auto">
        {fields.map((field, index) => (
          <section className="space-y-4 px-4" key={field.id}>
            <FormField
              control={form.control}
              name={`categories.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category {index + 1}</FormLabel>
                  <FormControl>
                    <Input
                      name={field.name}
                      value={field.value.replace(/\s/g, "")}
                      onChange={field.onChange}
                      placeholder="category"
                      className="uppercase placeholder:capitalize"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`categories.${index}.price`}
              render={({ field }) => (
                <FormItem
                  className={cn("", {
                    //! hide the price field if profit is false
                    hidden: !form.watch("profit"),
                  })}
                >
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`price ${index + 1}`}
                      name={field.name}
                      value={formattedInputPriceValue(field.value)}
                      onChange={field.onChange}
                      className="capitalize"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
          </section>
        ))}
      </ScrollArea>
      <div className="mt-4 flex flex-row items-center justify-end space-x-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setStep(1)}
        >
          Previous
        </Button>
        {isLoading ? (
          <Button disabled size="sm">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button disabled={disabledUpdateBtn} type="submit" size="sm">
            Update Event
          </Button>
        )}
      </div>
    </>
  )
}
