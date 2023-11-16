import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { createPublicVisitorSchema } from "~/src/types/schema"
import { cn } from "~/src/utils"
import { api } from "~/src/utils/api"
import { formattedPrice } from "~/src/utils/formattedPrice"
import { wait } from "~/src/utils/wait"
import { Button } from "~/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/ui/command"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/ui/form"
import { Input } from "~/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "~/ui/popover"
import { ScrollArea } from "~/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/ui/select"
import { ToastAction } from "~/ui/toast"
import { toast } from "~/ui/use-toast"

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  eventOrganizerId: string
  eventId: string
}

export const CreateTicketOrderForm = (props: Props) => {
  const utils = api.useUtils()

  const { mutate, isLoading } = api.visitor.createPublic.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your ticket has been successfully ordered.",
      })
      await utils.ticket.getAllByEventIdPublic.invalidate()
      await utils.visitor.getAll.invalidate()
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

  // const { data: tickets, status: ticketStatus } =
  //   api.ticket.getAllByEventIdPublic.useQuery(
  //     { eventId: props.eventId },
  //     {
  //       enabled: !!props.eventId,
  //       select: (tickets) => {
  //         const categories = tickets.map((ticket) => ticket.category)
  //         const _visitorTicketIds = tickets
  //           .filter((t) => t.visitors.length > 0)
  //           .map((t) => t.visitors)
  //           .reduce((acc, current) => {
  //             current.forEach((ticket) => {
  //               acc.push(ticket)
  //             })
  //             return acc
  //           }, [])
  //           .map((t) => ({ ticketId: t.ticketId }))
  //         const _selectedTicketIds = new Set(
  //           _visitorTicketIds.map((ticket) => ticket.ticketId),
  //         )
  //         const filteredTicketIds = tickets.filter(
  //           (ticket) => !_selectedTicketIds.has(ticket.id),
  //         )

  //         return {
  //           categories: [...new Set(categories)],
  //           filteredTicketIds,
  //         }
  //       },
  //     },
  //   )

  type CreatePublicVisitorSchema = z.infer<typeof createPublicVisitorSchema>
  const form = useForm<CreatePublicVisitorSchema>({
    resolver: zodResolver(createPublicVisitorSchema),
    defaultValues: {
      eventId: props.eventId,
      eventOrganizerId: props.eventOrganizerId,
      name: "",
      phone: "",
      email: "",
      ticketId: "",
    },
  })

  // const selectedCategory = form.watch("category")

  // select the price based on selectedCategory
  // const selectedPrice = [
  //   ...new Set(
  //     tickets?.filteredTicketIds
  //       .filter((f) => f.category === selectedCategory)
  //       .map((t) => t.price),
  //   ),
  // ]?.[0]

  function onSubmit(values: CreatePublicVisitorSchema) {
    const { name, phone, email, ticketId } = values

    mutate({
      name,
      phone,
      email,
      eventId: props.eventId,
      ticketId,
      eventOrganizerId: props.eventOrganizerId,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 grid gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-6 items-center gap-x-4">
                <FormLabel className="text-right">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name"
                    {...field}
                    className="col-span-3 w-[240px] capitalize"
                  />
                </FormControl>
              </div>
              <FormMessage className="pl-20" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-6 items-center gap-x-4">
                <FormLabel className="text-right">Phone</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="phone"
                    {...field}
                    className="col-span-3 w-[240px] capitalize"
                  />
                </FormControl>
              </div>
              <FormMessage className="pl-20" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-6 items-center gap-x-4">
                <FormLabel className="text-right">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email"
                    {...field}
                    className="col-span-3 w-[240px]"
                  />
                </FormControl>
              </div>
              <FormMessage className="pl-20" />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-6 items-center gap-x-4">
                <FormLabel className="text-right">Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl
                    className={cn(
                      "col-span-3 w-[240px]",
                      field.value && "uppercase",
                    )}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an Event" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ticketStatus === "success" &&
                      tickets.categories.map((category) => (
                        <SelectItem
                          value={category}
                          key={category}
                          className="uppercase"
                        >
                          {category}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <FormMessage className="pl-20" />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-6 items-center gap-x-4">
          <FormLabel className="text-right">Price</FormLabel>
          <div className="text-right text-sm font-medium text-amber-300">
            {!!selectedPrice
              ? formattedPrice.format(selectedPrice).replace(/,\d+$/, "")
              : ""}
          </div>
        </div> */}
        {/* <FormField
          control={form.control}
          name="ticketId"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-6 items-center gap-x-4">
                <FormLabel className="text-right">Ticket</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[240px] justify-between whitespace-nowrap pl-3 uppercase",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {!!field.value && ticketStatus === "success" ? (
                          tickets.filteredTicketIds
                            .find((ticket) => ticket.id === field.value)
                            ?.id.slice(-8)
                        ) : (
                          <span className="capitalize text-muted-foreground">
                            Select ticket...
                          </span>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search ticket..." />
                      <CommandEmpty>No ticket found.</CommandEmpty>
                      <CommandGroup>
                        <ScrollArea className="h-48">
                          {ticketStatus === "success" &&
                            tickets.filteredTicketIds
                              .filter(
                                (ticket) =>
                                  ticket.category === selectedCategory,
                              )
                              .map((ticket) => {
                                const ticketCategory = `${
                                  ticket.category
                                }-${ticket.id.slice(-8, ticket.id.length)}`
                                return (
                                  <CommandItem
                                    key={ticket.id}
                                    value={ticket.id}
                                    className="uppercase"
                                    onSelect={() => {
                                      form.setValue("ticketId", ticket.id)
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        ticket.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {ticketCategory}
                                  </CommandItem>
                                )
                              })}
                        </ScrollArea>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <FormMessage className="pl-20" />
            </FormItem>
          )}
        /> */}
        <div className="mt-8">
          {isLoading ? (
            <Button disabled size="sm">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit" size="sm">
              Order Ticket
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
