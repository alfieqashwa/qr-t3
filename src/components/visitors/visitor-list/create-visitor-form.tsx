import { zodResolver } from "@hookform/resolvers/zod"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { Loader2 } from "lucide-react"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import PhoneInput from "react-phone-number-input"
import type { z } from "zod"
import {
  createVisitorSchema,
  type extendVisitorFormSchema,
} from "~/src/types/schema"
import { cn } from "~/src/utils"
import { Button } from "~/ui/button"
import {
  Form,
  FormControl,
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
import { wait } from "~/utils/wait"

export const CreateVisitorForm = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const utils = api.useUtils()

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
      ticketId: "",
    },
  })

  //! no-need to use useEffect
  const selectedEventId = form.watch("eventId")
  const selectedCategory = form.watch("category")

  const [isProfit, setIsProfit] = useState(true)

  const events = api.event.getAll.useQuery(undefined, {
    select: (events) =>
      isProfit
        ? events
            .filter((f) => f.profit)
            .map(({ id, title, profit }) => ({
              id,
              title,
              profit,
            }))
        : events
            .filter((f) => !f.profit)
            .map(({ id, title, profit }) => ({
              id,
              title,
              profit,
            })),
  })

  const tickets = api.ticket.getAllByEventId.useQuery(
    { eventId: selectedEventId },
    {
      enabled: !!selectedEventId,
      select: (tickets) => {
        const categories = tickets.map((t) => t.category)
        /**
         * filtered only AVAILABlE tickets
         * & by selected category
         */
        const filteredTickets = tickets.filter(
          (t) => t.status === "AVAILABLE" && t.category === selectedCategory,
        )
        return {
          categories: [...new Set(categories)],
          filteredTickets,
        }
      },
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} className="capitalize" />
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
                <PhoneInput
                  defaultCountry="ID"
                  value={field.value.replace(/[^0-9+]/g, "")} //! [^0-9+] <-- only allowed user to type numeric-characters and '+' symbol
                  onChange={field.onChange}
                  className="flex h-10 w-[280px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
        <FormField
          control={form.control}
          name="eventId"
          render={({ field }) => (
            <FormItem>
              <ToggleProfit isProfit={isProfit} setIsProfit={setIsProfit} />
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right">Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className={cn("", field.value && "uppercase")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tickets.status === "success" &&
                    tickets.data.categories.map((category, i) => (
                      <SelectItem
                        value={category}
                        key={i}
                        className="uppercase"
                      >
                        {category}
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
          name="ticketId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right">Ticket</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="col-span-3 w-[240px] uppercase">
                  <SelectTrigger>
                    <SelectValue placeholder="Select ticket" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <ScrollArea className="h-56">
                    {tickets.status === "success" &&
                      tickets.data.filteredTickets.map((ticket) => {
                        const ticketCategory = `${
                          ticket.category
                        }-${ticket.id.slice(-8, -1)}`
                        return (
                          <SelectItem
                            key={ticket.id}
                            value={ticket.id}
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
            <Button type="submit" size="sm">
              Create Visitor
            </Button>
          )}
        </SheetFooter>
      </form>
    </Form>
  )
}

type TogglePRofitProps = {
  isProfit: boolean
  setIsProfit: React.Dispatch<React.SetStateAction<boolean>>
}

const ToggleProfit = ({ isProfit, setIsProfit }: TogglePRofitProps) => (
  <div className="flex items-center space-x-2">
    <Switch id="is-profit" checked={isProfit} onCheckedChange={setIsProfit} />
    <Label htmlFor="is-profit" className="text-xs text-amber-300">
      {isProfit ? "Profit Mode" : "Non-Profit Mode"}
    </Label>
  </div>
)
