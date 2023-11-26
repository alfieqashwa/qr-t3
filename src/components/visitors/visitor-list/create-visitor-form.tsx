import { zodResolver } from "@hookform/resolvers/zod"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { FlagPhoneInput } from "~/components/flag-phone-input"
import {
  createVisitorSchema,
  type extendVisitorFormSchema,
} from "~/src/types/schema"
import { cn } from "~/src/utils"
import { Button } from "~/ui/button"
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
import { Label } from "~/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/ui/select"
import { SheetFooter } from "~/ui/sheet"
import { Switch } from "~/ui/switch"
import { ToastAction } from "~/ui/toast"
import { toast } from "~/ui/use-toast"
import { api } from "~/utils/api"
import { formattedPrice } from "~/utils/formattedPrice"
import { wait } from "~/utils/wait"

export const CreateVisitorForm = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [step, setStep] = useState<1 | 2>(1)

  const utils = api.useUtils()

  // Mutations
  const { mutate, isLoading } = api.visitor.createEditorRole.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your form has been created.",
      })
      await utils.visitor.getAll.invalidate()
      await wait().then(() => setOpen(false))
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

  type CreateVisitorSchema = z.infer<typeof extendVisitorFormSchema>
  const form = useForm<CreateVisitorSchema>({
    resolver: zodResolver(createVisitorSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      eventId: "",
      categoryId: "",
      ticketId: "",
    },
  })

  //! no-need to use useEffect
  const selectedEventId = form.watch("eventId")
  const selectedCategoryId = form.watch("categoryId")

  const [isProfit, setIsProfit] = useState(true)

  const events = api.event.getAll.useQuery(undefined, {
    select: (events) =>
      /**
       *! NOTE:
       *! the `!!f.categories.length` is included in filter array
       *! to exclude the event(s) where doesn't have any category(s)
       */
      isProfit
        ? events.filter((f) => f.profit && !!f.categories.length)
        : events.filter((f) => !f.profit && !!f.categories.length),
  })

  // Queries
  const categories = api.category.getAllByEventId.useQuery(
    { eventId: selectedEventId },
    {
      enabled: !!selectedEventId,
      /**
       *! NOTE:
       *! the `!!f.tickets.length` is included in filter array
       *! to exclude the category(s) where doesn't have any ticket(s)
       */
      select: (categories) => categories.filter((c) => !!c.tickets.length),
    },
  )
  const filteredTickets = api.ticket.getAllByCategoryId.useQuery(
    { categoryId: selectedCategoryId },
    {
      enabled: !!selectedEventId,
      // filtered only AVAILABlE tickets
      select: (tickets) => tickets.filter((t) => t.status === "AVAILABLE"),
    },
  )

  function onSubmit(values: CreateVisitorSchema) {
    const { name, phone, email, ticketId } = values

    mutate({
      name,
      phone,
      email,
      ticketId,
    })
  }

  const selectedEmail = form.watch("email") as string

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
  }

  const selectedCategoryPrice = formattedPrice.format(
    categories.data?.find((c) => c.id === selectedCategoryId)?.price as number,
  )

  const disabledNextBtn =
    form.watch("name")?.length < 3 ||
    form.watch("phone")?.length < 12 ||
    validateEmail(selectedEmail) == null

  const disabledCreateBtn =
    disabledNextBtn ||
    !form.watch("eventId") ||
    !form.watch("categoryId") ||
    !form.watch("ticketId")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        {step === 1 && (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name"
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
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <FlagPhoneInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="absolute bottom-4 left-0 right-0 px-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="mb-1.5"
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
            <FormField
              control={form.control}
              name="eventId"
              render={({ field }) => (
                <FormItem>
                  <ToggleProfit isProfit={isProfit} setIsProfit={setIsProfit} />
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="capitalize">
                      <SelectTrigger>
                        <SelectValue placeholder="Select an event" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {events.status === "success" &&
                        events.data.map((event) => (
                          <SelectItem
                            value={event.id}
                            key={event.id}
                            className="capitalize"
                          >
                            <span className="pr-1">{event.title}</span>
                            <span className="lowercase text-amber-300">
                              {!!event.profit ? "(profit)" : "(non-profit)"}
                            </span>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right">Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className={cn("", field.value && "uppercase")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.status === "success" &&
                        categories.data.map((c) => (
                          <SelectItem
                            key={c.id}
                            value={c.id}
                            className="uppercase"
                          >
                            {c.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {!!selectedCategoryId && (
                    <FormDescription className="pt-2 text-base font-semibold">
                      Price:{" "}
                      <span className="text-amber-300">
                        {selectedCategoryPrice}
                      </span>
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ticketId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right">Ticket</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="col-span-3 w-[240px] uppercase">
                      <SelectTrigger>
                        <SelectValue placeholder="Select ticket" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <ScrollArea className="h-56">
                        {filteredTickets.status === "success" &&
                          filteredTickets.data.map((t) => {
                            const ticketCategory = `${t.category
                              ?.name}-${t.id.slice(-8, -1)}`
                            return (
                              <SelectItem
                                key={t.id}
                                value={t.id}
                                className="uppercase"
                              >
                                {ticketCategory}
                              </SelectItem>
                            )
                          })}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="absolute bottom-4 left-0 right-0 px-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                Previous
              </Button>
              {isLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  disabled={disabledCreateBtn}
                  type="submit"
                  className="mb-1.5"
                >
                  Create Visitor
                </Button>
              )}
            </SheetFooter>
          </>
        )}
      </form>
    </Form>
  )
}

type TogglePRofitProps = {
  isProfit: boolean
  setIsProfit: React.Dispatch<React.SetStateAction<boolean>>
}

const ToggleProfit = ({ isProfit, setIsProfit }: TogglePRofitProps) => (
  <div className="pb-2">
    <div className="flex items-center space-x-2">
      <Switch id="is-profit" checked={isProfit} onCheckedChange={setIsProfit} />
      <Label
        htmlFor="is-profit"
        className="text-sm font-semibold text-amber-300"
      >
        {isProfit ? "Profit" : "Non-Profit"}
      </Label>
    </div>
    <FormDescription className="mt-2 space-x-1">
      <span>
        Switch to {isProfit ? "left" : "right"} to create a{" "}
        {isProfit ? "non-profit" : "profit"} event.
      </span>
      <span>
        {isProfit ? "e.g: wedding, party, etc" : "e.g: concert, gigs, training"}
      </span>
    </FormDescription>
  </div>
)
