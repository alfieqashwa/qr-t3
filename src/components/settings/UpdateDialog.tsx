import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/src/utils/api";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { CardDescription } from "../ui/card";
import { useState } from "react";
import { CommandCombobox } from "../Combobox";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";

type Props = {
  id: string;
  name: string;
  phone: string;
  street: string;
  postalCode: string;
};
export function UpdateEventOrganizerDialog({
  id,
  name,
  phone,
  street,
  postalCode,
}: Props) {
  const router = useRouter();
  const utils = api.useContext();
  const { toast } = useToast();

  const { mutate, isLoading, error } = api.eo.update.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your message has been sent.",
      });
      await utils.eo.invalidate();
      router.reload();
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

  const [nameValue, setNameValue] = useState<string>(name);
  const [phoneValue, setPhoneValue] = useState<string>(phone);
  const [streetValue, setStreetValue] = useState<string>(street);
  const [provinceValue, setProvinceValue] = useState<string>("");
  const [regencyValue, setRegencyValue] = useState<string>("");
  const [districtValue, setDistrictValue] = useState<string>("");
  const [villageValue, setVillageValue] = useState<string>("");
  const [postalCodeValue, setPostalCodeValue] = useState<string>(postalCode);

  const { data: provinces, isLoading: isProvincesLoading } =
    api.address.getProvinces.useQuery();

  // find selected province.id
  const provinceId = provinces?.find(
    (province) => province.name.toLowerCase() === provinceValue
  )?.id;

  const { data: regencies, isLoading: isRegenciesLoading } =
    api.address.getRegencies.useQuery(undefined, {
      enabled: provinceValue !== "" && provinceValue !== undefined,
      select: (data) =>
        data.filter((district) => district.province_id === provinceId),
    });

  const regencyId = regencies?.find(
    (r) => r.name.toLowerCase() === regencyValue
  )?.id;

  const { data: districts, isLoading: isDistrictsLoading } =
    api.address.getDistricts.useQuery(undefined, {
      enabled: regencyValue !== "" && regencyValue !== undefined,
      select: (data) => data.filter((d) => d.regency_id === regencyId),
    });

  const districtId = districts?.find(
    (district) => district.name.toLowerCase() === districtValue
  )?.id;

  const { data: villages, isLoading: isVillagesLoading } =
    api.address.getVillages.useQuery(undefined, {
      enabled: districtValue !== "" && districtValue !== undefined,
      select: (data) => data.filter((d) => d.district_id === districtId),
    });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = nameValue.toLowerCase();
    const phone = phoneValue;
    const street = streetValue.toLowerCase();
    const province = provinceValue;
    const regency = regencyValue;
    const district = districtValue;
    const village = villageValue;
    const postalCode = postalCodeValue.toLowerCase();

    mutate({
      id,
      name,
      phone,
      street,
      province,
      regency,
      district,
      village,
      postalCode,
    });
  };

  const disabled =
    provinceValue === "" ||
    regencyValue === "" ||
    districtValue === "" ||
    villageValue === "";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Update Event Organizer</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-1/2">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Event Organizer</DialogTitle>
            <DialogDescription>
              Make changes to your event organizer here. Click save when
              you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Name */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                className="capitalize"
              />
              {error?.data?.zodError?.fieldErrors.name && (
                <span className="text-xs text-destructive">
                  {error?.data?.zodError?.fieldErrors.name}
                </span>
              )}
            </div>
            {/* Phone */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={phoneValue}
                onChange={(e) => setPhoneValue(e.target.value)}
              />
              {error?.data?.zodError?.fieldErrors.phone && (
                <span className="text-xs text-destructive">
                  {error?.data?.zodError?.fieldErrors.phone}
                </span>
              )}
            </div>
            {/* Street */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="street" className="text-left">
                Street
              </Label>
              <Input
                id="street"
                name="street"
                value={streetValue}
                onChange={(e) => setStreetValue(e.target.value)}
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
                value={postalCodeValue}
                onChange={(e) => setPostalCodeValue(e.target.value)}
              />
              {error?.data?.zodError?.fieldErrors.postalCode && (
                <span className="text-xs text-destructive">
                  {error?.data?.zodError?.fieldErrors.postalCode}
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button disabled={disabled} type="submit">
                Save changes
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
