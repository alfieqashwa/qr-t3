import { zodResolver } from "@hookform/resolvers/zod"
import { Status } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { wait } from "~/src/utils/wait"
import { Button } from "~/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/ui/select"
import { ToastAction } from "~/ui/toast"
import { toast } from "~/ui/use-toast"
import { api } from "~/utils/api"

type Props = {
  id: string
  ticketStatus: Status
}

export function PurchaseTicket({ id, ticketStatus }: Props) {
  const [open, setOpen] = useState(false)

  const utils = api.useContext()

  const { mutate, isLoading } = api.ticket.updateStatus.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Ticket status has been updated.",
      })
      /* auto-closed after succeed submit the dialog form */
      await wait().then(() => setOpen(!open))
      await utils.visitor.getAll.invalidate()
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

  const FormSchema = z.object({
    status: z.nativeEnum(Status),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      status: ticketStatus,
    },
    mode: "onChange",
  })

  function onSubmit(values: z.infer<typeof FormSchema>) {
    const { status } = values

    mutate({
      id,
      status,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant={ticketStatus === "AVAILABLE" ? "secondary" : "default"}
        >
          {ticketStatus}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-1/2">
        <DialogHeader>
          <DialogTitle>Purchase Ticket</DialogTitle>
          <DialogDescription asChild>
            <p>Change your ticket here. Click Update when you&apos;re done.</p>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
            className="grid gap-4"
          >
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Status</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value as Status)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={ticketStatus} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ticketStatus === "AVAILABLE" ? (
                        <SelectItem value={Status.SOLD}>
                          {Status.SOLD}
                        </SelectItem>
                      ) : (
                        <SelectItem value={Status.AVAILABLE}>
                          {Status.AVAILABLE}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select SOLD if the visitor has already purchased the ticket.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4 flex flex-row items-center justify-end space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpen(!open)}
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
                  Update
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
