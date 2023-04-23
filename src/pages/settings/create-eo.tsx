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
    <form onSubmit={handleSubmit} className="thom mt-8 h-[calc(100vh_-_17vh)]">
      <div>
        <label>Name</label>
        <input className="text-slate-700" name="name" />
      </div>
      <div>
        <label>Phone</label>
        <input className="text-slate-700" name="phone" />
      </div>
      <div>
        <h3>Address</h3>
        <div>
          <label>Street</label>
          <input className="text-slate-700" name="street" />
        </div>
        <div>
          <label>City</label>
          <input className="text-slate-700" name="city" />
        </div>
        <div>
          <label>Postal Code</label>
          <input className="text-slate-700" name="postalCode" />
        </div>
        <button type="submit">Submit</button>
      </div>
    </form>
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
