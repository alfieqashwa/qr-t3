import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

interface IFormInput {
  firstName: string;
  lastName: string;
}

export const CreateEO = (): JSX.Element => {
  const { register, handleSubmit } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="thom mt-8 h-[calc(100vh_-_17vh)] text-slate-700"
    >
      <input {...register("firstName", { required: true, maxLength: 20 })} />
      <input {...register("lastName", { pattern: /^[A-Za-z]+$/i })} />
      <button type="submit">Submit</button>
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
