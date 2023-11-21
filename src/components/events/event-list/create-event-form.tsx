import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import type { SelectSingleEventHandler } from "react-day-picker"
import { useFieldArray, useForm } from "react-hook-form"
import type * as z from "zod"
import { cn } from "~/src/utils"
import { formattedInputPriceValue } from "~/src/utils/formattedPrice"
import { extendCreateEventSchema } from "~/types/schema"
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
  const [step, setStep] = useState<1 | 2>(1)
  const utils = api.useUtils()
  const { toast } = useToast()

  const { mutate, isLoading } = api.event.createAdminRole.useMutation({
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

  const form = useForm<z.infer<typeof extendCreateEventSchema>>({
    resolver: zodResolver(extendCreateEventSchema),
    defaultValues: {
      title: "",
      venue: "",
      date: new Date(),
      profit: true,
      categories: [
        {
          name: "",
          price: "",
        },
      ],
    },
  })

  const [timeValue, setTimeValue] = useState<string>("00:00")

  const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const time = e.target.value
    setTimeValue(time)
  }

  const { fields, append, remove } = useFieldArray({
    name: "categories",
    control: form.control,
  })

  function onSubmit(values: z.infer<typeof extendCreateEventSchema>) {
    const { title, venue, profit, date, categories: _categories } = values

    const initialPrice = 0.0 // -> non-profit condition
    const categories = _categories.map((c) => ({
      name: c.name,
      price:
        c.price === "" ? initialPrice : parseFloat(c.price.replace(/,/g, "")),
    }))

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
      minutes,
    )

    mutate({
      title,
      venue,
      profit,
      date: newSelectedDate,
      categories,
    })
  }

  const disabledNextBtn =
    form.watch("title").length < 5 || form.watch("venue").length < 3
  const disabledCreateBtn =
    disabledNextBtn || form.watch("categories").some((c) => c.name === "")
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        {step === 1 && (
          <>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="title"
                      {...field}
                      className="capitalize"
                    />
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
                    <Input
                      placeholder="venue"
                      {...field}
                      className="capitalize"
                    />
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
                            !field.value && "text-muted-foreground",
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
                    <FormLabel className="text-amber-300">
                      {field.value ? "Provit" : "Non-provit"}
                    </FormLabel>
                    <FormDescription className="space-x-1">
                      <span>Switch to left to create a non-profit event.</span>
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
                type="button"
                variant="outline"
                onClick={() => props.setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={disabledNextBtn}
                onClick={() => setStep(2)}
              >
                Next Step
              </Button>
            </SheetFooter>
          </>
        )}
        {step === 2 && (
          <>
            <ScrollArea className="-mx-4 max-h-[32rem] overflow-y-auto">
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
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className={cn("", {
                        hidden: form.watch("categories").length > 5,
                      })}
                      onClick={() => append({ name: "", price: "" })}
                    >
                      Add More
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  </div>
                  <Separator />
                </section>
              ))}
            </ScrollArea>
            <SheetFooter className="absolute bottom-8 left-0 right-0 px-6">
              <Button
                type="button"
                variant="outline"
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
                <Button disabled={disabledCreateBtn} type="submit" size="sm">
                  Create Event
                </Button>
              )}
            </SheetFooter>
          </>
        )}
      </form>
    </Form>
  )
}
