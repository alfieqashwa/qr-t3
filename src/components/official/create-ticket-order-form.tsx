import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { cn } from "~/src/utils"
import { extendCreatePublicVisitorSchema } from "~/types/schema"
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
import { api, type RouterOutputs } from "~/utils/api"
import { formattedPrice } from "~/utils/formattedPrice"
import { wait } from "~/utils/wait"

type CreateTicketOrderFormProps = {
  event: RouterOutputs["event"]["getByIdPublic"]
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const CreateTicketOrderForm = ({
  event,
  setOpen,
}: CreateTicketOrderFormProps) => {
  const utils = api.useUtils()

  // Mutations
  const { mutate, isLoading } = api.visitor.createPublic.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your ticket has been successfully ordered.",
      })
      await utils.ticket.getAllByCategoryIdPublic.invalidate()
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

  type CreatePublicVisitorSchema = z.infer<
    typeof extendCreatePublicVisitorSchema
  >
  const form = useForm<CreatePublicVisitorSchema>({
    resolver: zodResolver(extendCreatePublicVisitorSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      categoryId: "",
      ticketId: "",
    },
  })

  const selectedCategoryId = form.watch("categoryId")

  // Queries
  const tickets = api.ticket.getAllByCategoryIdPublic.useQuery(
    { categoryId: selectedCategoryId },
    { enabled: !!selectedCategoryId },
  )

  const selectedPrice = event?.categories?.find(
    (c) => c.id === selectedCategoryId,
  )?.price

  function onSubmit(values: CreatePublicVisitorSchema) {
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
        <FormField
          control={form.control}
          name="categoryId"
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
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {event?.categories &&
                      event.categories
                        .filter((c) => !!c.tickets.length)
                        .map((c) => (
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
        </div>
        <FormField
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
                        {!!field.value && tickets.status === "success" ? (
                          tickets.data
                            .filter((t) => t.id === field.value)
                            .map((t) => {
                              const ticketCategory = `${t.category
                                ?.name}-${t.id.slice(-8, t.id.length)}`
                              return ticketCategory
                            })
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
                          {tickets.status === "success" &&
                            tickets.data
                              .filter(
                                (ticket) =>
                                  ticket.categoryId === selectedCategoryId,
                              )
                              .map((ticket) => {
                                const ticketCategory = `${ticket.category
                                  ?.name}-${ticket.id.slice(
                                  -8,
                                  ticket.id.length,
                                )}`
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
        />
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
