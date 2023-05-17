import { Role } from "@prisma/client";
import { Loader2 } from "lucide-react";
import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { CommandCombobox } from "~/src/components/Combobox";
import { Button } from "~/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/src/components/ui/card";
import { DialogFooter } from "~/src/components/ui/dialog";
import { Input } from "~/src/components/ui/input";
import { Label } from "~/src/components/ui/label";
import { ToastAction } from "~/src/components/ui/toast";
import { useToast } from "~/src/components/ui/use-toast";
import { authOptions } from "~/src/server/auth";
import { api } from "~/src/utils/api";

const CreateEO: NextPage = (): JSX.Element => {
  const router = useRouter();
  const { toast } = useToast();

  const updateUserRoleAsAdmin = api.user.updateRole.useMutation();
  const { mutate, isLoading, error } = api.eo.create.useMutation({
    async onSuccess() {
      // update user role as ADMIN
      await updateUserRoleAsAdmin.mutateAsync({ role: Role.ADMIN });
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your form has been created.",
      });
      await router.push("/dashboard");
    },
    onError() {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const [provinceValue, setProvinceValue] = useState<string>("");
  const [regencyValue, setRegencyValue] = useState<string>("");
  const [districtValue, setDistrictValue] = useState<string>("");
  const [villageValue, setVillageValue] = useState<string>("");

  const { data: provinces, isLoading: isProvincesLoading } =
    api.address.provinces.useQuery();

  // find selected province.id
  const provinceId = provinces?.find(
    (province) => province.name.toLowerCase() === provinceValue
  )?.id;

  const { data: regencies, isLoading: isRegenciesLoading } =
    api.address.regencies.useQuery(undefined, {
      enabled: provinceValue !== "" && provinceValue !== undefined,
      select: (data) =>
        data.filter((district) => district.provinceId === provinceId),
    });

  const regencyId = regencies?.find(
    (r) => r.name.toLowerCase() === regencyValue
  )?.id;

  const { data: districts, isLoading: isDistrictsLoading } =
    api.address.districts.useQuery(undefined, {
      enabled: regencyValue !== "" && regencyValue !== undefined,
      select: (data) => data.filter((d) => d.regencyId === regencyId),
    });

  const districtId = districts?.find(
    (district) => district.name.toLowerCase() === districtValue
  )?.id;

  const { data: villages, isLoading: isVillagesLoading } =
    api.address.villages.useQuery(undefined, {
      enabled: districtValue !== "" && districtValue !== undefined,
      select: (data) => data.filter((d) => d.districtId === districtId),
    });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString().toLowerCase() as string;
    const phone = formData.get("phone") as string;
    const province = provinceValue;
    const regency = regencyValue;
    const district = districtValue;
    const village = villageValue;
    const street = formData.get("street")?.toString()?.toLowerCase() as string;
    const postalCode = formData.get("postalCode") as string;

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
    });
  };

  const disabled =
    provinceValue === "" ||
    regencyValue === "" ||
    districtValue === "" ||
    villageValue === "";

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
                  datas={provinces}
                  isLoading={isProvincesLoading}
                  value={provinceValue}
                  setValue={setProvinceValue}
                  placeholder="province"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Regency</Label>
                <CommandCombobox
                  datas={regencies}
                  isLoading={isRegenciesLoading}
                  value={regencyValue}
                  setValue={setRegencyValue}
                  placeholder="regency"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="district">Distric</Label>
                <CommandCombobox
                  datas={districts}
                  isLoading={isDistrictsLoading}
                  value={districtValue}
                  setValue={setDistrictValue}
                  placeholder="district"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="village">Village</Label>
                <CommandCombobox
                  datas={villages}
                  isLoading={isVillagesLoading}
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
                  onClick={() => void signOut()}
                >
                  Sign Out
                </Button>
                {isLoading ? (
                  <Button disabled className="w-1/2">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button disabled={disabled} className="w-1/2">
                    Submit
                  </Button>
                )}
              </DialogFooter>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEO;

// If No Authenticated, then redirect to Home Page. Else, enter this page.
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // If user has EventOrganizerId, then cannot enter this page "/settings/create-eo"
  if (session && session.user.eventOrganizerId) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
};

/**
 * FROM T3 DOCS
<form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      mutate({ title: formData.get('title') });
    }}>
      <input name="title" />
      {error?.data?.zodError?.fieldErrors.title && (
        <span className="mb-8 text-red-500">
          {error.data.zodError.fieldErrors.title}
        </span>
      )}

      ...
    </form>
 */
