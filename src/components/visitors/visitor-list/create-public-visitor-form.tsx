import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { createPublicVisitorSchema } from "~/src/types/schema"
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
  eventOrganizerId: string
  eventId: string
}

export const CreatePublicVisitorForm = (props: Props) => {
  const utils = api.useContext()

  const { mutate, isLoading } = api.visitor.createPublic.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your form has been created.",
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

  const { data: tickets, status: ticketStatus } =
    api.ticket.getAllByEventIdPublic.useQuery(
      { eventId: props.eventId },
      {
        enabled: !!props.eventId,
        select: (tickets) => {
          const categories = tickets.map((ticket) => ticket.category)
          return {
            categories: [...new Set(categories)],
            all: tickets,
          }
        },
      }
    )

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

  const selectedCategory = form.watch("category")

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
                    {ticketStatus === "success" &&
                      tickets.all
                        .filter(
                          (ticket) => ticket.category === selectedCategory
                        )
                        .map((ticket) => {
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
              Purchase Ticket
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
