import { Role } from "@prisma/client"
import { Loader2 } from "lucide-react"
import type { GetServerSideProps, NextPage } from "next"
import { getServerSession } from "next-auth"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useState } from "react"
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
import { Input } from "~/ui/input"
import { Label } from "~/ui/label"
import { ToastAction } from "~/ui/toast"
import { useToast } from "~/ui/use-toast"
import { api } from "~/utils/api"

const CreateEOPage: NextPage = (): JSX.Element => {
  const [session, router] = [useSession(), useRouter()]
  const { toast } = useToast()

  const updateUserRoleAsAdmin = api.user.updateRoleAdminRole.useMutation()
  const { mutate, isLoading, error } = api.eo.create.useMutation({
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

  const [provinceValue, setProvinceValue] = useState<string>("")
  const [regencyValue, setRegencyValue] = useState<string>("")
  const [districtValue, setDistrictValue] = useState<string>("")
  const [villageValue, setVillageValue] = useState<string>("")

  const provincesQuery = api.address.provinces.useQuery(undefined, {
    select: (provinces: Province[]) =>
      provinces.sort((a, b) => a.name.localeCompare(b.name)),
  })

  // find selected province.id
  const provinceId = provincesQuery?.data?.find(
    (p) => p.name.toLowerCase() === provinceValue
  )?.id as string

  const regenciesQuery = api.address.regencies.useQuery(
    { provinceId },
    {
      enabled: !!provinceId && provinceValue !== "",
      select: (regencies: Regency[]) =>
        regencies
          .filter((regency) => regency.province_id === provinceId)
          .sort((a, b) => a.name.localeCompare(b.name)),
    }
  )

  const regencyId = regenciesQuery?.data?.find(
    (r) => r.name.toLowerCase() === regencyValue
  )?.id as string

  const districtsQuery = api.address.districts.useQuery(
    { regencyId },
    {
      enabled: !!regencyId && regencyValue !== "",
      select: (districts: District[]) =>
        districts
          .filter((district) => district.regency_id === regencyId)
          .sort((a, b) => a.name.localeCompare(b.name)),
    }
  )

  const districtId = districtsQuery?.data?.find(
    (d) => d.name.toLowerCase() === districtValue
  )?.id as string

  const villagesQuery = api.address.villages.useQuery(
    { districtId },
    {
      enabled: !!districtId && districtValue !== "",
      select: (villages: Village[]) =>
        villages.filter((village) => village.district_id === districtId),
    }
  )

  const villageId = villagesQuery?.data?.find(
    (v) => v.name.toLowerCase() === villageValue
  )?.id

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name")?.toString().toLowerCase() as string
    const phone = formData.get("phone") as string
    const province = provinceValue
    const regency = regencyValue
    const district = districtValue
    const village = villageValue
    const street = formData.get("street")?.toString()?.toLowerCase() as string
    const postalCode = formData.get("postalCode") as string

    // call the mutate function with the form data
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

    // delete user from db & signed-out if not fill the form and submit
    deleteMeIfISignedOut.mutate({
      id,
    })
    void signOut()
  }

  const disabled =
    provinceValue === "" ||
    regencyValue === "" ||
    districtValue === "" ||
    villageValue === "" ||
    villageId === null

  return (
    <div className="grid min-h-screen place-items-center">
      <Card className="w-1/3 shadow-md shadow-amber-300">
        <CardHeader>
          <CardTitle>Create New Event Organizer</CardTitle>
          <CardDescription>Deploy your new EO in one-click.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Name of your Event Organizer"
                  className="capitalize"
                />
                {error?.data?.zodError?.fieldErrors.name && (
                  <span className="text-xs text-destructive">
                    {error?.data?.zodError?.fieldErrors.name}
                  </span>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                />
                {error?.data?.zodError?.fieldErrors.phone && (
                  <span className="text-xs text-destructive">
                    {error?.data?.zodError?.fieldErrors.phone}
                  </span>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  type="text"
                  name="street"
                  placeholder="Street"
                  className="capitalize"
                />
                {error?.data?.zodError?.fieldErrors.street && (
                  <span className="text-xs text-destructive">
                    {error?.data?.zodError?.fieldErrors.street}
                  </span>
                )}
              </div>
              <CardDescription className="mt-2">Select Address</CardDescription>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Province</Label>
                <CommandCombobox
                  datas={provincesQuery.data}
                  isLoading={provincesQuery.isLoading}
                  value={provinceValue}
                  setValue={setProvinceValue}
                  placeholder="province"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Regency</Label>
                <CommandCombobox
                  datas={regenciesQuery.data}
                  isLoading={regenciesQuery.isLoading}
                  value={regencyValue}
                  setValue={setRegencyValue}
                  placeholder="regency"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="district">Distric</Label>
                <CommandCombobox
                  datas={districtsQuery.data}
                  isLoading={districtsQuery.isLoading}
                  value={districtValue}
                  setValue={setDistrictValue}
                  placeholder="district"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="village">Village</Label>
                <CommandCombobox
                  datas={villagesQuery.data}
                  isLoading={villagesQuery.isLoading}
                  value={villageValue}
                  setValue={setVillageValue}
                  placeholder="village"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                />
                {error?.data?.zodError?.fieldErrors.postalCode && (
                  <span className="text-xs text-destructive">
                    {error?.data?.zodError?.fieldErrors.postalCode}
                  </span>
                )}
              </div>
              <DialogFooter className="mx-auto mt-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="w-1/2"
                  onClick={deleteUser}
                >
                  Sign Out
                </Button>
                {isLoading ? (
                  <Button disabled className="w-1/2">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button type="submit" disabled={disabled} className="w-1/2">
                    Submit
                  </Button>
                )}
              </DialogFooter>
            </div>
          </form>
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
        : `/${slug}/dashboard`

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
