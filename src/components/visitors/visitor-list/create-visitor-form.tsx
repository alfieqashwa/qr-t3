import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { createVisitorSchema } from "~/src/types/schema"
import { api } from "~/src/utils/api"
import { wait } from "~/src/utils/wait"
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
}

export const CreateVisitorForm = (props: Props) => {
  const utils = api.useContext()

  const { mutate, isLoading } = api.visitor.create.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your form has been created.",
      })
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

  type CreateVisitorSchema = z.infer<typeof createVisitorSchema>
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

  console.log({ selectedCategory })

  const events = api.event.getAll.useQuery(undefined, {
    select: (events) =>
      events.map(({ id, title }) => ({
        id,
        title,
      })),
  })

  const ticketCategory = api.ticket.getAllByEventId.useQuery(
    { eventId: selectedEventId },
    {
      enabled: !!selectedEventId,
      select: (tickets) => {
        const categories = tickets.map((ticket) => ticket.category)
        return [...new Set(categories)]
      },
    }
  )

  const tickets = api.ticket.getAllByEventId.useQuery(
    { eventId: selectedEventId },
    {
      enabled: !!selectedEventId,
      select: (tickets) =>
        tickets.map(({ id, category }) => ({
          id,
          category,
          categoryType: [...new Set(tickets.map((c) => c.category))],
        })),
    }
  )

  function onSubmit(values: CreateVisitorSchema) {
    const { name, phone, email, eventId, ticketId } = values

    mutate({
      name,
      phone,
      email,
      eventId,
      ticketId,
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
              <FormMessage className="text-center" />
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
              <FormMessage className="text-center" />
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
              <FormMessage className="text-center" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="eventId"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-6 items-center gap-x-4">
                <FormLabel className="text-right">Event</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="col-span-3 w-[240px] capitalize">
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
                          {event.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <FormMessage className="text-center" />
            </FormItem>
          )}
        />
        <FormField
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
                  <FormControl className="col-span-3 w-[240px] uppercase">
                    <SelectTrigger>
                      <SelectValue placeholder="Select an event" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ticketCategory.status === "success" &&
                      ticketCategory.data.map((category) => (
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
              <FormMessage className="text-center" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ticketId"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-6 items-center gap-x-4">
                <FormLabel className="text-right">Ticket</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="col-span-3 w-[240px] uppercase">
                    <SelectTrigger>
                      <SelectValue placeholder="Select an event" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {!!getSelection &&
                      tickets.status === "success" &&
                      tickets.data
                        .filter(
                          (ticket) => ticket.category === selectedCategory
                        )
                        .map((ticket) => {
                          const ticketCategory = `${
                            ticket.category
                          }-${ticket.id.slice(-8, -1)}`
                          return (
                            <SelectItem
                              value={ticket.id}
                              key={ticket.id}
                              className="uppercase"
                            >
                              {ticketCategory}
                            </SelectItem>
                          )
                        })}
                  </SelectContent>
                </Select>
              </div>
              <FormMessage className="text-center" />
            </FormItem>
          )}
        />
        <div className="mt-8">
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
        </div>
      </form>
    </Form>
  )
}
