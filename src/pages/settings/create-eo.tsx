import { Input } from "@/src/components/ui/Input";
import { authOptions } from "@/src/server/auth";
import { api } from "@/src/utils/api";
import type { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";

const CreateEO: NextPage = (): JSX.Element => {
  const utils = api.useContext();
  const { mutate } = api.eo.create.useMutation({
    async onSuccess() {
      // await utils.eo.getEO();
      await utils.eo.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const street = formData.get("street") as string;
    const city = formData.get("city") as string;
    const postalCode = formData.get("postalCode") as string;

    // call the mutate function with the form data
    mutate({ name, phone, street, city, postalCode });
  };

  return (
    <div className="grid h-screen place-items-center">
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
        <Input
          className="mt-6 text-base"
          type="text"
          name="city"
          placeholder="City"
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
          disabled
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
