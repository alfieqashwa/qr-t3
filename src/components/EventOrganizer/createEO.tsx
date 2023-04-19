import { api } from "@/src/utils/api";
import { useState } from "react";
interface FormValues {
  name: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
}

export const CreateEO = (): JSX.Element => {
  const [formValues, setFormValues] = useState<FormValues>({
    name: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
  });

  const { name, phone, street, city, postalCode } = formValues;

  const { mutate } = api.eo.create.useMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const street = formData.get("street") as string;
    const city = formData.get("city") as string;
    const postalCode = formData.get("postalCode") as string;

    // set the form values to state
    setFormValues({
      name,
      phone,
      street,
      city,
      postalCode,
    });

    // call the mutate function with the form data
    mutate({ name, phone, street, city, postalCode });
  };

  return (
    <form onSubmit={handleSubmit} className="thom mt-8 h-[calc(100vh_-_17vh)]">
      <div>
        <label>Name</label>
        <input
          className="text-slate-700"
          name="name"
          value={name}
          onChange={(e) =>
            setFormValues({ ...formValues, name: e.target.value })
          }
        />
      </div>
      <div>
        <label>Phone</label>
        <input
          className="text-slate-700"
          name="phone"
          value={phone}
          onChange={(e) =>
            setFormValues({ ...formValues, phone: e.target.value })
          }
        />
      </div>
      <div>
        <h3>Address</h3>
        <div>
          <label>Street</label>
          <input
            className="text-slate-700"
            name="street"
            value={street}
            onChange={(e) =>
              setFormValues({ ...formValues, street: e.target.value })
            }
          />
        </div>
        <div>
          <label>City</label>
          <input
            className="text-slate-700"
            name="city"
            value={city}
            onChange={(e) =>
              setFormValues({ ...formValues, city: e.target.value })
            }
          />
        </div>
        <div>
          <label>Postal Code</label>
          <input
            className="text-slate-700"
            name="postalCode"
            value={postalCode}
            onChange={(e) =>
              setFormValues({ ...formValues, postalCode: e.target.value })
            }
          />
        </div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
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
