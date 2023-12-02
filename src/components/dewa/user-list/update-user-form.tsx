import { zodResolver } from "@hookform/resolvers/zod"
import { Role } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { updateUserSchema } from "~/types/schema"
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/ui/select"
import { ToastAction } from "~/ui/toast"
import { toast } from "~/ui/use-toast"
import { api, type RouterOutputs } from "~/utils/api"
import { wait } from "~/utils/wait"

type Props = {
  user: RouterOutputs["user"]["getByIdDewaRole"]
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const UpdateUserForm = (props: Props): JSX.Element => {
  const utils = api.useUtils()

  const { mutate, isLoading } = api.user.updateUserDewaRole.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "The user has been updated.",
      })
      /* auto-closed after succeed submit the dialog form */
      await wait().then(() => props.setOpen(false))
      await utils.user.getAllDewaRole.invalidate()
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

  type UpdateUserSchema = z.infer<typeof updateUserSchema>

  const defaultValues: UpdateUserSchema = {
    id: props.user?.id as string,
    name: "",
    role: props.user?.role as Role,
  }

  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(values: UpdateUserSchema) {
    const { id, name, role } = values

    mutate({
      id,
      name: name?.toLowerCase() ?? "",
      role,
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className="grid gap-4"
      >
        {/* Name */}
        {/* //! BUGS: Cannot input space... */}
        {props.user?.name != undefined && (
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
        )}
        {/* Role */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-6 items-center gap-x-4">
                <FormLabel className="text-right">Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-[240px] uppercase">
                    <SelectTrigger>
                      <SelectValue placeholder="select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={Role.ADMIN} className="uppercase">
                        Admin
                      </SelectItem>
                      <SelectItem value={Role.EDITOR} className="uppercase">
                        Editor
                      </SelectItem>
                      <SelectItem value={Role.OPERATOR} className="uppercase">
                        Operator
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </FormItem>
          )}
        />
        <div className="mt-4 flex flex-row items-center justify-end space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => props.setOpen(false)}
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
