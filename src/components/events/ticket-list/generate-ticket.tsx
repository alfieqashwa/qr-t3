import { zodResolver } from "@hookform/resolvers/zod"
import { FilePlus2, Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { formattedPrice } from "~/src/utils/formattedPrice"
import { generateTicketSchema } from "~/types/schema"
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

  // Mutations
  const { mutate, isLoading } = api.ticket.generateTicketEditorRole.useMutation(
    {
      async onSuccess() {
        toast({
          title: "Succeed!",
          variant: "default",
          description: "Your ticket(s) has been created.",
        })
        await utils.ticket.getAll.invalidate()
        await utils.category.options.invalidate()
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
  const form = useForm<z.infer<typeof generateTicketSchema>>({
    resolver: zodResolver(generateTicketSchema),
    defaultValues: {
      eventId: "",
      categoryId: "",
      qty: 0,
    },
  })

  // Queries
  const { data: events, status } = api.event.getAll.useQuery(undefined, {
    // only renders profit events
    select: (data) => data.filter((d) => d.profit),
  })

  const categories = api.category.getAllByEventId.useQuery(
    { eventId: form.watch("eventId") },
    { enabled: !!form.watch("eventId") },
  )

  // 2. Define a submit handler.
  function onSubmit(value: z.infer<typeof generateTicketSchema>) {
    const { eventId, categoryId, qty } = value

    mutate({
      eventId,
      categoryId,
      qty,
    })
  }

  const selectedCategoryPrice = formattedPrice.format(
    categories.data?.find((c) => c.id === form.watch("categoryId"))
      ?.price as number,
  )

  const disabled =
    form.watch("eventId") === "" ||
    form.watch("categoryId") === "" ||
    form.watch("qty") < 10

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
                          placeholder="Select event"
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
              name="categoryId"
              render={({ field }) => (
                <FormItem className="pt-4">
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="uppercase">
                      <SelectTrigger>
                        <SelectValue placeholder="select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
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
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormDescription className="pt-2 text-base font-semibold">
                    Price:{" "}
                    <span className="text-amber-300">
                      {selectedCategoryPrice}
                    </span>
                  </FormDescription>
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
