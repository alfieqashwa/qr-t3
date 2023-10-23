import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { CommandCombobox } from "~/components/combobox"
import type { District, Province, Regency, Village } from "~/src/types/address"
import { updateEventOrganizerSchema } from "~/src/types/schema"
import { api, type RouterOutputs } from "~/src/utils/api"
import { wait } from "~/src/utils/wait"
import { Button } from "~/ui/button"
import { CardDescription } from "~/ui/card"
import { DialogFooter } from "~/ui/dialog"
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

type UpdateEventOrganizerFormProps = {
  eo: RouterOutputs["eo"]["read"]
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const UpdateEventOrganizerForm = ({
  eo,
  setOpen,
}: UpdateEventOrganizerFormProps) => {
  const utils = api.useUtils()

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

  const provinces = api.address.provinces.useQuery(undefined, {
    select: (provinces: Province[]) =>
      provinces.sort((a, b) => a.name.localeCompare(b.name)),
  })
  const provinceId = provinces.data?.find(
    (p) => p.name.toLowerCase() === form.watch("province")
  )?.id as string

  const regencies = api.address.regencies.useQuery(
    { provinceId },
    {
      enabled: !!provinceId,
      select: (regencies: Regency[]) =>
        regencies
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter((r) => r.province_id === provinceId),
    }
  )
  const regencyId = regencies.data?.find(
    (r) => r.name.toLowerCase() === form.watch("regency")
  )?.id as string

  const districts = api.address.districts.useQuery(
    { regencyId },
    {
      enabled: !!regencyId,
      select: (districts: District[]) =>
        districts
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter((d) => d.regency_id === regencyId),
    }
  )
  const districtId = districts.data?.find(
    (d) => d.name.toLowerCase() === form.watch("district")
  )?.id as string

  const villages = api.address.villages.useQuery(
    { districtId },
    {
      enabled: !!districtId,
      select: (villages: Village[]) =>
        villages
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter((v) => v.district_id === districtId),
    }
  )

  /*
   * disabled-button validation!
   * to avoid unmatching between regencyId -> villageId records into database
   */
  const villageId = villages.data?.find(
    (v) => v.name.toLowerCase() === form.watch("village")
  )?.id as string

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

    //? mutate
    mutate({
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

  /*
   * disabled-button validation!
   * to avoid unmatching between provinceId -> regencyId -> districtId -> villageId records into database
   */
  const disabled = regencyId == null || districtId == null || villageId == null

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
            <FormItem className="grid grid-cols-4 items-center gap-x-4">
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
            <FormItem className="grid grid-cols-4 items-center gap-x-4">
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
            <FormItem className="grid grid-cols-4 items-center gap-x-4">
              <FormLabel className="mt-2 text-right">Street</FormLabel>
              <FormControl>
                <Input {...field} className="col-span-3 w-[240px] capitalize" />
              </FormControl>
            </FormItem>
          )}
        />
        <CardDescription className="mt-4">Select Address</CardDescription>
        {/* Province */}
        <FormField
          control={form.control}
          name="province"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4">
              <FormLabel className="ml-auto">Province</FormLabel>
              <CommandCombobox
                name="province"
                value={field.value}
                status={provinces.status}
                datas={provinces.data}
                form={form}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Regency */}
        <FormField
          control={form.control}
          name="regency"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4">
              <FormLabel className="ml-auto">Regency</FormLabel>
              <CommandCombobox
                name="regency"
                value={field.value}
                status={regencies.status}
                datas={regencies.data}
                form={form}
              />
            </FormItem>
          )}
        />
        {/* District */}
        <FormField
          control={form.control}
          name="district"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4">
              <FormLabel className="ml-auto">District</FormLabel>
              <CommandCombobox
                name="district"
                value={field.value}
                status={districts.status}
                datas={districts.data}
                form={form}
              />
            </FormItem>
          )}
        />
        {/* Village */}
        <FormField
          control={form.control}
          name="village"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4">
              <FormLabel className="ml-auto">Village</FormLabel>
              <CommandCombobox
                name="village"
                value={field.value}
                status={villages.status}
                datas={villages.data}
                form={form}
              />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-x-4">
              <FormLabel className="ml-auto mt-2 whitespace-nowrap text-right">
                Postal Code
              </FormLabel>
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
            <Button disabled={disabled} type="submit" size="sm">
              Save changes
            </Button>
          )}
        </DialogFooter>
      </form>
    </Form>
  )
}
