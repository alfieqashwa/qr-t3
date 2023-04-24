import { CommandCombobox } from "@/src/components/Combobox";
import { Input } from "@/src/components/ui/input";
import { authOptions } from "@/src/server/auth";
import { api } from "@/src/utils/api";
import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { useState } from "react";
import { prisma } from "@/server/db";
import { toast } from "react-hot-toast";

const CreateEO: NextPage = (): JSX.Element => {
  const router = useRouter();

  // const utils = api.useContext();
  const { mutate, isLoading, error } = api.eo.create.useMutation({
    async onSuccess() {
      // await utils.eo.getEO();
      // await utils.eo.invalidate();
      await router.push("/dashboard");
    },
    // onError(e) {
    //   const errorMessage = e.data?.zodError?.fieldErrors.name;

    //   if (errorMessage && errorMessage[0]) {
    //     toast.error(errorMessage[0]);
    //   } else {
    //     toast.error("Failed to post! Please try again later.");
    //   }
    // },
  });

  const [provinceValue, setProvinceValue] = useState<string>("");
  const [regencyValue, setRegencyValue] = useState<string>("");
  const [districtValue, setDistrictValue] = useState<string>("");
  const [villageValue, setVillageValue] = useState<string>("");

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
    isLoading ||
    provinceValue === "" ||
    regencyValue === "" ||
    districtValue === "" ||
    villageValue === "";

  return (
    <div className="grid min-h-screen place-items-center">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-1/3 flex-col justify-center rounded-2xl border-4 border-slate-500 px-16 py-12 shadow-xl"
      >
        <h1 className="text-center text-2xl font-bold text-slate-300">
          Create New Event Organizer
        </h1>
        <Input
          className="mt-10 text-base"
          type="text"
          name="name"
          placeholder="Name"
        />
        {error?.data?.zodError?.fieldErrors.name && (
          <span className="text-red-500">ERROR!!!</span>
        )}

        <Input
          className="mt-6 text-base"
          type="text"
          name="phone"
          placeholder="Phone"
        />
        <Input
          className="mt-6 text-base"
          type="text"
          name="street"
          placeholder="Street"
        />
        <CommandCombobox
          datas={provinces}
          isLoading={isProvincesLoading}
          value={provinceValue}
          setValue={setProvinceValue}
          placeholder="province"
        />
        <CommandCombobox
          datas={regencies}
          isLoading={isRegenciesLoading}
          value={regencyValue}
          setValue={setRegencyValue}
          placeholder="regency"
        />
        <CommandCombobox
          datas={districts}
          isLoading={isDistrictsLoading}
          value={districtValue}
          setValue={setDistrictValue}
          placeholder="district"
        />
        <CommandCombobox
          datas={villages}
          isLoading={isVillagesLoading}
          value={villageValue}
          setValue={setVillageValue}
          placeholder="village"
        />
        <Input
          className="mt-6 text-base"
          type="text"
          name="postalCode"
          placeholder="Postal Code"
        />
        <button
          className="duration mx-auto mt-12 h-12 w-1/2 rounded-xl border-2 border-slate-400 font-bold text-slate-400 transition hover:border-slate-300 hover:text-slate-300 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-700"
          type="submit"
          disabled={disabled}
        >
          Submit
        </button>
      </form>
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

  const eoId = await prisma.user.findUnique({
    where: { id: session?.user.id },
    select: { eventOrganizerId: true },
  });

  if (eoId?.eventOrganizerId) {
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
