import { api } from "@/src/utils/api";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
// import type { RouterOutputs } from "@/src/utils/api";

type FormInput = {
  name: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
};

// type TCreateEO = RouterOutputs["eo"]["create"];

export const CreateEO = (): JSX.Element => {
  const { register, handleSubmit, reset, clearErrors } = useForm<FormInput>();

  const { mutate } = api.eo.create.useMutation({
    onSuccess: () => {
      clearErrors();
      reset();
    },
  });

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="thom mt-8 h-[calc(100vh_-_17vh)]"
    >
      <div>
        <label>Name</label>
        <input
          className="text-slate-700"
          {...register("name", { required: true, maxLength: 20 })}
        />
      </div>
      <div>
        <label>Phone</label>
        <input
          className="text-slate-700"
          {...register("phone", { required: true, maxLength: 20 })}
        />
      </div>
      <div>
        <h3>Address</h3>
        <div>
          <label>Street</label>
          <input
            className="text-slate-700"
            {...register("street", { required: true, maxLength: 20 })}
          />
        </div>
        <div>
          <label>City</label>
          <input
            className="text-slate-700"
            {...register("city", { required: true, maxLength: 20 })}
          />
        </div>
        <div>
          <label>Postal Code</label>
          <input
            className="text-slate-700"
            {...register("postalCode", { required: true, maxLength: 20 })}
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
