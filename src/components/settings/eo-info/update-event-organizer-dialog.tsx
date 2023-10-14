import { Check, ChevronsUpDown, Edit, Loader2 } from "lucide-react"
import React, { useState } from "react"
import { CommandCombobox } from "~/components/combobox"
import type { RouterOutputs } from "~/src/utils/api"
import { api } from "~/src/utils/api"
import { wait } from "~/src/utils/wait"
import type { District, Province, Regency, Village } from "~/types/address"
import { Button } from "~/ui/button"
import { CardDescription } from "~/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog"
import { Input } from "~/ui/input"
import { Label } from "~/ui/label"
import { ToastAction } from "~/ui/toast"
import { toast, useToast } from "~/ui/use-toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateEventOrganizerSchema } from "~/src/types/schema"
import { z } from "zod"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { cn } from "~/src/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../../ui/command"

export function UpdateEventOrganizerDialog({
  eo,
}: {
  eo: RouterOutputs["eo"]["read"]
}) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center space-x-1"
        >
          <Edit size={16} />
          <span>Update</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-1/2">
        <DialogHeader>
          <DialogTitle>Edit Event Organizer</DialogTitle>
          <DialogDescription>
            Make changes to your event organizer here. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <UpdateEventOrganizerFrom eo={eo} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}

type UpdateEventOrganizerFromProps = {
  eo: RouterOutputs["eo"]["read"]
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const UpdateEventOrganizerFrom = ({
  eo,
  setOpen,
}: UpdateEventOrganizerFromProps) => {
  const utils = api.useContext()

  const { mutate, isLoading } = api.eo.updateAdminRole.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your EO has been updated.",
      })
      await utils.eo.read.invalidate()
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
  })

  type UpdateEventOrganizerSchema = z.infer<typeof updateEventOrganizerSchema>

  const defaultValues: UpdateEventOrganizerSchema = {
    id: eo?.id as string,
    name: eo?.name as string,
    phone: eo?.phone as string,
    street: eo?.street as string,
    province: eo?.province as string,
    regency: eo?.regency as string,
    district: eo?.district as string,
    village: eo?.village as string,
    postalCode: eo?.postalCode as string,
  }

  const form = useForm<UpdateEventOrganizerSchema>({
    resolver: zodResolver(updateEventOrganizerSchema),
    defaultValues,
    mode: "onChange",
  })

  const { data: provinces } = api.address.provinces.useQuery(undefined, {
    select: (provinces: Province[]) =>
      provinces.sort((a, b) => a.name.localeCompare(b.name)),
  })

  const provinceId = provinces?.find(
    (p) => p.name.toLowerCase() === form.watch("province")
  )?.id as string

  const { data: regencies } = api.address.regencies.useQuery(
    { provinceId },
    {
      enabled: !!provinceId,
      select: (regencies: Regency[]) =>
        regencies.filter((r) => r.province_id === provinceId),
    }
  )

  function onSubmit(values: UpdateEventOrganizerSchema) {
    const {
      name,
      phone,
      street,
      province,
      regency,
      district,
      village,
      postalCode,
    } = values

    // mutate
    console.log({
      id: eo?.id as string,
      name,
      phone,
      street,
      province,
      regency,
      district,
      village,
      postalCode,
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => form.handleSubmit(onSubmit)(e)}
        className="relative"
      >
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid grid-cols-6 items-center gap-x-4">
              <FormLabel className="mt-2 text-right">Name</FormLabel>
              <FormControl>
                <Input {...field} className="col-span-3 w-[240px] capitalize" />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="grid grid-cols-6 items-center gap-x-4">
              <FormLabel className="mt-2 text-right">Phone</FormLabel>
              <FormControl>
                <Input {...field} className="col-span-3 w-[240px] capitalize" />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Street */}
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem className="grid grid-cols-6 items-center gap-x-4">
              <FormLabel className="mt-2 text-right">Street</FormLabel>
              <FormControl>
                <Input {...field} className="col-span-3 w-[240px] capitalize" />
              </FormControl>
            </FormItem>
          )}
        />
        <CardDescription className="mt-2">Select Address</CardDescription>
        {/* Province */}
        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem className="grid grid-cols-6 items-center gap-x-4">
              <FormLabel>Province</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "mt-6 w-[240px] justify-between whitespace-nowrap pl-3 uppercase",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ?? "Select Province"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="end" className="p-0">
                  <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandEmpty>No province found.</CommandEmpty>
                    <CommandGroup>
                      {provinces
                        ?.sort((a, b) => a.name.localeCompare(b.name))
                        .map((p) => (
                          <CommandItem
                            value={p.name}
                            key={p.id}
                            onSelect={() => {
                              form.setValue("province", p.name.toLowerCase())
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                p.name === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {p.name}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Regency */}
        <FormField
          control={form.control}
          name="regency"
          render={({ field }) => (
            <FormItem className="grid grid-cols-6 items-center gap-x-4">
              <FormLabel>Regency</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "mt-6 w-[240px] justify-between whitespace-nowrap pl-3 uppercase",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {!!field.value &&
                      regencies?.find(
                        (r) => r.name.toLowerCase() === field.value
                      ) ? (
                        regencies?.find(
                          (r) => r.name.toLowerCase() === field.value
                        )?.name
                      ) : (
                        <span className="capitalize text-muted-foreground">
                          Select Regency...
                        </span>
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="end" className="p-0">
                  <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandEmpty>No Regency found.</CommandEmpty>
                    <CommandGroup>
                      {regencies
                        ?.sort((a, b) => a.name.localeCompare(b.name))
                        .map((r) => (
                          <CommandItem
                            value={r.name}
                            key={r.id}
                            onSelect={() => {
                              form.setValue("regency", r.name.toLowerCase())
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                r.name === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {r.name}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem className="grid grid-cols-6 items-center gap-x-4">
              <FormLabel className="mt-2 text-right">Title</FormLabel>
              <FormControl>
                <Input {...field} className="col-span-3 w-[240px] capitalize" />
              </FormControl>
            </FormItem>
          )}
        />
        <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
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
              Save changes
            </Button>
          )}
        </DialogFooter>
      </form>
    </Form>
  )
}
