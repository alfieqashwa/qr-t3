import { Edit, Loader2 } from "lucide-react";
import { useState } from "react";
import { CommandCombobox } from "~/components/Combobox";
import { Button } from "~/components/ui/button";
import { CardDescription } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ToastAction } from "~/components/ui/toast";
import { useToast } from "~/components/ui/use-toast";
import type { RouterOutputs } from "~/src/utils/api";
import { api } from "~/src/utils/api";
import { wait } from "~/src/utils/wait";

type Props = {
  currentEO: RouterOutputs["eo"]["read"];
};
export function UpdateEventOrganizerDialog({ currentEO }: Props) {
  const utils = api.useContext();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const { mutate, isLoading, error } = api.eo.update.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your EO has been updated.",
      });
      await utils.eo.read.invalidate();
      /* auto-closed after succeed submit the dialog form */
      await wait().then(() => setOpen(false));
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

  const [provinceValue, setProvinceValue] = useState<string>(
    currentEO?.province as string
  );
  const [regencyValue, setRegencyValue] = useState<string>(
    currentEO?.regency as string
  );
  const [districtValue, setDistrictValue] = useState<string>(
    currentEO?.district as string
  );
  const [villageValue, setVillageValue] = useState<string>(
    currentEO?.village as string
  );

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

  /*
    disabled-button validation!
    to avoid not-matching between provinceId-regencyId-districtId-villageId records into database
  */
  const villageId = villages?.find(
    (village) => village.name.toLowerCase() === villageValue
  )?.id;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = currentEO?.id as string;
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString().toLowerCase() as string;
    const phone = formData.get("phone") as string;
    const street = formData.get("street")?.toString().toLowerCase() as string;
    const province = provinceValue;
    const regency = regencyValue;
    const district = districtValue;
    const village = villageValue;
    const postalCode = formData
      .get("postalCode")
      ?.toString()
      .toLowerCase() as string;

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

  const disabled = regencyId == null || districtId == null || villageId == null;

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
                defaultValue={currentEO?.name}
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
              <Input id="phone" name="phone" defaultValue={currentEO?.phone} />
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
                defaultValue={currentEO?.street}
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
                defaultValue={currentEO?.postalCode}
              />
              {error?.data?.zodError?.fieldErrors.postalCode && (
                <span className="text-xs text-destructive">
                  {error?.data?.zodError?.fieldErrors.postalCode}
                </span>
              )}
            </div>
          </div>
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
      </DialogContent>
    </Dialog>
  );
}
