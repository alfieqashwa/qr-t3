import { zodResolver } from "@hookform/resolvers/zod"
import { FilePlus2, Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { formattedInputPriceValue } from "~/src/utils/formattedPrice"
import { extendGenerateTicketSchema } from "~/types/schema"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/ui/sheet"
import { ToastAction } from "~/ui/toast"
import { toast } from "~/ui/use-toast"
import { api } from "~/utils/api"
import { wait } from "~/utils/wait"

export function GenerateTicket(): JSX.Element {
  const [open, setOpen] = useState(false)

  const utils = api.useUtils()

  const { data: events, status } = api.event.getAll.useQuery(undefined, {
    // only renders the profit events
    select: (data) => data.filter((d) => d.profit),
  })

  const tickets = api.ticket.getAll.useQuery(
    { isProfit: true },
    {
      select: (tickets) => {
        const categories = [
          ...new Set(tickets.map((ticket) => ticket.category)),
        ]
        return {
          all: tickets,
          categories,
        }
      },
    },
  )

  const { mutate, isLoading } = api.ticket.generateTicketEditorRole.useMutation(
    {
      async onSuccess() {
        toast({
          title: "Succeed!",
          variant: "default",
          description: "Your ticket(s) has been created.",
        })
        await utils.ticket.getAll.invalidate()
        await utils.ticket.categories.invalidate()
        await wait().then(() => setOpen(false))
        form.reset()
      },

      onError() {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      },
    },
  )

  // 1. Define form.
  const form = useForm<z.infer<typeof extendGenerateTicketSchema>>({
    resolver: zodResolver(extendGenerateTicketSchema),
    defaultValues: {
      eventId: "",
      categorySelect: "",
      categoryInput: "",
      price: "",
      qty: 0,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(value: z.infer<typeof extendGenerateTicketSchema>) {
    const { eventId, categorySelect, categoryInput, price, qty } = value

    let category: string
    if (!categorySelect || categorySelect === "create-new") {
      category = categoryInput.toLowerCase()
    } else {
      category = categorySelect.toLowerCase()
    }

    mutate({
      eventId,
      category,
      price: parseFloat(price.replace(/,/g, "")),
      qty,
    })
  }

  const watchEventId = form.watch("eventId")
  const watchSelectCateg = form.watch("categorySelect")
  const watchInputCateg = form.watch("categoryInput")

  const disabled =
    !watchEventId ||
    ((!watchSelectCateg || watchSelectCateg === "create-new") &&
      (watchInputCateg.length < 3 || watchInputCateg.length > 15))

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-2 h-8 whitespace-nowrap"
        >
          <FilePlus2 className="mr-2 h-4 w-4" />
          Generate Ticket
        </Button>
      </SheetTrigger>

      <SheetContent className="bg-card">
        <SheetHeader>
          <SheetTitle>Generate New Ticket</SheetTitle>
          <SheetDescription>
            Create new ticket(s) here. Click Generate Ticket when you&apos;re
            done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            {/* Select Event ID */}
            <FormField
              control={form.control}
              name="eventId"
              render={({ field }) => (
                <FormItem className="pt-4">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormLabel>Event</FormLabel>
                    <FormControl>
                      <SelectTrigger className="w-[240px] uppercase">
                        <SelectValue
                          placeholder="Select an event"
                          className="capitalize"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {status === "success" &&
                          events.map((event) => (
                            <SelectItem
                              value={event.id}
                              className="capitalize"
                              key={event.id}
                            >
                              {event.title}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* CategorySelect */}
            <FormField
              control={form.control}
              name="categorySelect"
              render={({ field }) => (
                <FormItem className="pt-4">
                  <FormLabel>Category</FormLabel>
                  <FormDescription>Select category...</FormDescription>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!watchEventId || !!watchInputCateg}
                  >
                    <FormControl className="uppercase">
                      <SelectTrigger>
                        <SelectValue placeholder="select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="create-new" className="uppercase">
                          OR Create New
                        </SelectItem>
                        {tickets.status === "success" &&
                          tickets.data.categories.map((cat, i) => (
                            <SelectItem
                              key={i}
                              value={cat}
                              className="uppercase"
                            >
                              {cat}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            {/* CategoryInput */}
            <FormField
              control={form.control}
              name="categoryInput"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>Or create a new one...</FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={
                        !watchEventId ||
                        (!!watchSelectCateg &&
                          watchSelectCateg !== "create-new")
                      }
                      placeholder="create a new one..."
                      className="uppercase"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="pt-4">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Price..."
                      name={field.name}
                      value={formattedInputPriceValue(field.value)}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Qty */}
            <FormField
              control={form.control}
              name="qty"
              render={({ field }) => (
                <FormItem className="pt-4">
                  <FormLabel>Qty</FormLabel>
                  <FormControl>
                    <Input placeholder="How many ticket(s)..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="absolute bottom-8 left-0 right-0 px-6">
              <Button
                className="mt-2 sm:mt-0"
                type="button"
                variant="outline"
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
                <Button type="submit" disabled={disabled} size="sm">
                  Generate Ticket
                </Button>
              )}
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
