import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type * as z from "zod"

import { Loader2 } from "lucide-react"
import type { createVisitorSchema } from "~/types/schema"
import { createEventSchema } from "~/types/schema"
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
import { useToast } from "~/ui/use-toast"
import { api } from "~/utils/api"
import { wait } from "~/utils/wait"
import { useSession } from "next-auth/react"

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function CreateVisitorForm(props: Props) {
  const { data: session } = useSession()
  const utils = api.useContext()
  const { toast } = useToast()

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
    resolver: zodResolver(createEventSchema),
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

  const events = api.event.getAll.useQuery(undefined, {
    select: (events) =>
      events.map(({ id, title }) => ({
        id,
        title,
      })),
  })

  const tickets = api.ticket.getAllByEventId.useQuery(
    { eventId: selectedEventId },
    {
      enabled: !!selectedEventId,
      select: (tickets) =>
        tickets.map(({ id, category }) => ({
          id,
          category,
        })),
    }
  )

  function onSubmit(values: CreateVisitorSchema) {
    const { name, phone, email, eventId, ticketId } = values

    console.log(`testset`)

    console.log({
      name,
      phone,
      email,
      eventOrganizerId: session?.user.eventOrganizerId as string,
      eventId,
      ticketId,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Input placeholder="phone" {...field} />
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
              <FormLabel>Event</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {events.status === "success" &&
                    events.data.map((event) => (
                      <SelectItem value={event.id} key={event.id}>
                        {event.title}
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
              <FormLabel>Ticket</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a ticket" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tickets.status === "success" &&
                    tickets.data.map((ticket) => (
                      <SelectItem value={ticket.id} key={ticket.id}>
                        {ticket.category}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {isLoading ? (
          <Button disabled size="sm">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" size="sm">
            Create
          </Button>
        )}
      </form>
    </Form>
  )
}
