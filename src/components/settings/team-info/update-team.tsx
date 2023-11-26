import { Role } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { Button } from "~/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog"
import { Label } from "~/ui/label"
import { ToastAction } from "~/ui/toast"
import { useToast } from "~/ui/use-toast"
import { api } from "~/utils/api"

type Props = {
  id: string
  username: string | null
  email: string
  currentRole: Role
}

export function UpdateTeam({ id, username, currentRole, email }: Props) {
  const utils = api.useUtils()
  const { toast } = useToast()

  const [open, setOpen] = useState(false)

  const { mutate, isLoading, error } = api.user.updateTeamAdminRole.useMutation(
    {
      async onSuccess() {
        toast({
          title: "Succeed!",
          variant: "default",
          description: "Your team has been updated.",
        })
        await utils.user.getAllByEOIdAdminRole.invalidate()
        await utils.user.getRoleAdminRole.invalidate()
        /* auto-closed after succeed submit the dialog form */
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
    },
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const role = formData.get("role") as Role

    mutate({
      id,
      role,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="whitespace-nowrap">
          Edit Role
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card">
        <DialogHeader>
          <DialogTitle>
            Update Team{" "}
            <span
              className={cn("capitalize text-amber-300", {
                lowercase: username == null,
              })}
            >
              {username ?? email}
            </span>
          </DialogTitle>
          <DialogDescription>
            Edit role of your team here. Click Update Team when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-3" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name" className="mb-1">
              User Role
            </Label>
            <SelectRole role={currentRole} />
            {error?.data?.zodError?.fieldErrors.role && (
              <span className="text-xs text-destructive">
                {error.data.zodError.fieldErrors.role}
              </span>
            )}
          </div>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
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
                Update Team
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { wait } from "~/src/utils/wait"
import { cn } from "~/src/utils"

export function SelectRole({ role }: { role: Role }) {
  return (
    <Select name="role" defaultValue={role}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Role</SelectLabel>
          <SelectItem value={Role.EDITOR}>{Role.EDITOR}</SelectItem>
          <SelectItem value={Role.OPERATOR}>{Role.OPERATOR}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
