import { zodResolver } from "@hookform/resolvers/zod"
import { Role } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import type * as z from "zod"
import { createTeamSchema } from "~/types/schema"
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
import { ToastAction } from "~/ui/toast"
import { useToast } from "~/ui/use-toast"
import { api } from "~/utils/api"
import { wait } from "~/utils/wait"

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function CreateTeamForm(props: Props) {
  const session = useSession()
  const utils = api.useContext()
  const { toast } = useToast()

  const createTeam = api.user.create.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your new team has been created.",
      })
      await utils.user.getAllByEOId.invalidate()
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

  // 1. Define form.
  const form = useForm<z.infer<typeof createTeamSchema>>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      email: "",
      role: Role.OPERATOR,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof createTeamSchema>) {
    // Do something with the form values.
    // This will be type-safe and validated.

    // console.log(values);
    const { email, role } = values

    if (session.status !== "authenticated") return
    if (session.data.user.email === email) {
      return toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please DO NOT input your own email, Dude!",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }

    createTeam.mutate({
      email,
      role,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="pt-4">
              <FormLabel>User Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="pt-4">
              <Select
                // TODOS: zod convert enum -> string
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                onValueChange={field.onChange}
                defaultValue={field.value as Role}
              >
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={Role.EDITOR}>{Role.EDITOR}</SelectItem>
                    <SelectItem value={Role.OPERATOR}>
                      {Role.OPERATOR}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormDescription className="pt-2">
                Select your team&apos;s access level.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {createTeam.isLoading ? (
          <Button disabled size="sm">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" size="sm">
            Create Team
          </Button>
        )}
      </form>
    </Form>
  )
}
