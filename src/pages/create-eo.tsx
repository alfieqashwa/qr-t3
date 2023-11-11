import { zodResolver } from "@hookform/resolvers/zod"
import { Role } from "@prisma/client"
import { Loader2 } from "lucide-react"
import type { GetServerSideProps, NextPage } from "next"
import { getServerSession } from "next-auth"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { CommandCombobox } from "~/components/combobox"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { authOptions } from "~/server/auth"
import { prisma } from "~/server/db"
import type { District, Province, Regency, Village } from "~/types/address"
import { Button } from "~/ui/button"
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
import { api } from "~/utils/api"
import { createEventOrganizerSchema } from "../types/schema"

const CreateEOPage: NextPage = (): JSX.Element => {
  const [session, router] = [useSession(), useRouter()]

  const updateUserRoleAsAdmin = api.user.updateRoleToAdmin.useMutation()
  const { mutate, isLoading } = api.eo.create.useMutation({
    async onSuccess(_data, variables) {
      const { name } = variables
      // update user role as ADMIN
      await updateUserRoleAsAdmin.mutateAsync({ role: Role.ADMIN })
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your form has been created.",
      })
      await router.push(`/${name.replace(/\s+/g, "-")}/dashboard`)
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

  type CreateEventOrganizerSchema = z.infer<typeof createEventOrganizerSchema>

  const defaultValues: CreateEventOrganizerSchema = {
    name: "",
    phone: "",
    street: "",
    province: "",
    regency: "",
    district: "",
    village: "",
    postalCode: "",
  }

  const form = useForm<CreateEventOrganizerSchema>({
    resolver: zodResolver(createEventOrganizerSchema),
    defaultValues,
    mode: "onChange",
  })

  const provinces = api.address.provinces.useQuery(undefined, {
    select: (provinces: Province[]) =>
      provinces.sort((a, b) => a.name.localeCompare(b.name)),
  })
  //* find selected province.id
  const provinceId = provinces.data?.find(
    (p) => p.name.toLowerCase() === form.watch("province"),
  )?.id as string

  const regencies = api.address.regencies.useQuery(
    { provinceId },
    {
      enabled: !!provinceId,
      select: (regencies: Regency[]) =>
        regencies
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter((r) => r.province_id === provinceId),
    },
  )
  const regencyId = regencies.data?.find(
    (r) => r.name.toLowerCase() === form.watch("regency"),
  )?.id as string

  const districts = api.address.districts.useQuery(
    { regencyId },
    {
      enabled: !!regencyId,
      select: (districts: District[]) =>
        districts
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter((d) => d.regency_id === regencyId),
    },
  )

  const districtId = districts.data?.find(
    (d) => d.name.toLowerCase() === form.watch("district"),
  )?.id as string

  const villages = api.address.villages.useQuery(
    { districtId },
    {
      enabled: !!districtId,
      select: (villages: Village[]) =>
        villages.filter((v) => v.district_id === districtId),
    },
  )

  /*
   * disabled-button validation!
   * to avoid unmatching between regencyId -> villageId records into database
   */
  const villageId = villages.data?.find(
    (v) => v.name.toLowerCase() === form.watch("village"),
  )?.id as string

  function onSubmit(values: CreateEventOrganizerSchema) {
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
      name,
      phone,
      province,
      regency,
      district,
      village,
      street,
      postalCode,
    })
  }

  //? delete user if the user sign-out before submiting the form
  const deleteMeIfISignedOut = api.user.deleteMe.useMutation({
    onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "See you later.",
      })
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

  const deleteUser = () => {
    if (session.status !== "authenticated") return
    const id = session.data.user.id

    //? call the mutate delete-me-if-i-signed-out
    deleteMeIfISignedOut.mutate({
      id,
    })
    void signOut()
  }

  /*
   * disabled-button validation!
   * to avoid unmatching between provinceId -> regencyId -> districtId -> villageId records into database
   */
  const disabled = regencyId == null || districtId == null || villageId == null

  return (
    <div className="grid min-h-screen place-items-center">
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">
            Create New Event Organizer
          </CardTitle>
          <CardDescription>
            Deploy new Event Organizer in one-click.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-1 items-center gap-x-4 sm:grid-cols-5">
                    <FormLabel className="sm:text-right">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-[280px] capitalize sm:col-span-3"
                      />
                    </FormControl>
                    <FormMessage className="sm:col-span-5 sm:text-center" />
                  </FormItem>
                )}
              />
              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="mt-3 grid grid-cols-1 items-center gap-x-4 sm:mt-1 sm:grid-cols-5">
                    <FormLabel className="sm:text-right">Phone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-[280px] capitalize sm:col-span-3"
                      />
                    </FormControl>
                    <FormMessage className="sm:col-span-5 sm:text-center" />
                  </FormItem>
                )}
              />
              {/* Street */}
              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem className="mt-3 grid grid-cols-1 items-center gap-x-4 sm:mt-1 sm:grid-cols-5">
                    <FormLabel className="sm:text-right">Street</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-[280px] capitalize sm:col-span-3"
                      />
                    </FormControl>
                    <FormMessage className="sm:col-span-5 sm:text-center" />
                  </FormItem>
                )}
              />
              <CardDescription className="mt-4">Select Address</CardDescription>
              {/* Province */}
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem className="mt-3 grid grid-cols-1 items-center gap-x-4 sm:mt-1 sm:grid-cols-5">
                    <FormLabel className="sm:text-right">Province</FormLabel>
                    <CommandCombobox
                      className="w-[280px]"
                      name="province"
                      value={field.value}
                      status={provinces.status}
                      datas={provinces.data}
                      form={form}
                    />
                  </FormItem>
                )}
              />
              {/* Regency */}
              <FormField
                control={form.control}
                name="regency"
                render={({ field }) => (
                  <FormItem className="mt-3 grid grid-cols-1 items-center gap-x-4 sm:mt-1 sm:grid-cols-5">
                    <FormLabel className="sm:text-right">Regency</FormLabel>
                    <CommandCombobox
                      className="w-[280px]"
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
                  <FormItem className="mt-3 grid grid-cols-1 items-center gap-x-4 sm:mt-1 sm:grid-cols-5">
                    <FormLabel className="sm:text-right">District</FormLabel>
                    <CommandCombobox
                      className="w-[280px]"
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
                  <FormItem className="mt-3 grid grid-cols-1 items-center gap-x-4 sm:mt-1 sm:grid-cols-5">
                    <FormLabel className="sm:text-right">Village</FormLabel>
                    <CommandCombobox
                      className="w-[280px]"
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
                  <FormItem className="mt-3 grid grid-cols-1 items-center gap-x-4 sm:mt-1 sm:grid-cols-5">
                    <FormLabel className="whitespace-nowrap sm:text-right">
                      Postal Code
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-[280px] capitalize sm:col-span-3"
                      />
                    </FormControl>
                    <FormMessage className="sm:col-span-5 sm:text-center" />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
                <Button type="button" variant="outline" onClick={deleteUser}>
                  Sign Out
                </Button>
                {isLoading ? (
                  <Button disabled size="sm">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button disabled={disabled} type="submit" size="sm">
                    Submit
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateEOPage

// If No Authenticated, then redirect to Home Page. Else, enter this page.
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  if (session && session.user.eventOrganizerId) {
    const getEoNameBySessionId = await prisma.eventOrganizer.findUnique({
      where: { id: session.user.eventOrganizerId },
      select: { name: true },
    })

    const slug = getEoNameBySessionId?.name.replace(/\s+/g, "-") as string

    const destination =
      session.user.role === "OPERATOR"
        ? `/${slug}/scanner` // If user has EventOrganizerId and user role as an OPERATOR, then enter this page.
        : `/${slug}/event`

    return {
      redirect: {
        destination,
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}
