import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import PhoneInput from "react-phone-number-input"
import type { z } from "zod"
import { updateVisitorSchema } from "~/src/types/schema"
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
import { ToastAction } from "~/ui/toast"
import { toast } from "~/ui/use-toast"
import type { RouterOutputs } from "~/utils/api"
import { api } from "~/utils/api"
import { wait } from "~/utils/wait"

type Props = {
  visitor: RouterOutputs["visitor"]["getById"]
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const UpdateVisitorForm = ({ visitor, setOpen }: Props): JSX.Element => {
  const utils = api.useUtils()

  const { mutate, isLoading } = api.visitor.updateEditorRole.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "The visitor has been updated.",
      })
      /* auto-closed after succeed submit the dialog form */
      await wait().then(() => setOpen(false))
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

  type UpdateVisitorSchema = z.infer<typeof updateVisitorSchema>

  const defaultValues: UpdateVisitorSchema = {
    id: visitor?.id as string,
    name: visitor?.name as string,
    phone: visitor?.phone as string,
    email: visitor?.email as string,
  }

  const form = useForm<UpdateVisitorSchema>({
    resolver: zodResolver(updateVisitorSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(values: UpdateVisitorSchema) {
    const { id, name, phone, email } = values

    mutate({
      id,
      name,
      phone,
      email,
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className="grid gap-4"
      >
        {/* Name */}
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
        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-6 items-center gap-x-4">
                <FormLabel className="text-right">Phone</FormLabel>
                <FormControl>
                  <PhoneInput
                    defaultCountry="ID"
                    value={field.value.replace(/[^0-9+]/g, "")} //! [^0-9+] <-- only allowed user to type numeric-characters and '+' symbol
                    onChange={field.onChange}
                    className="flex h-10 w-[280px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </FormControl>
              </div>
              <FormMessage className="text-center" />
            </FormItem>
          )}
        />
        {/* Email */}
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
        <div className="mt-4 flex flex-row items-center justify-end space-x-2">
          <Button
            type="button"
            variant="ghost"
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
              Update
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
