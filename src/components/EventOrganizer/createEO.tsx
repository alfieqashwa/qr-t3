import { api } from "@/src/utils/api";

export const CreateEO = (): JSX.Element => {
  //  const { mutate, error } = api.post.create.useMutation();
  const { mutate, error } = api.eo.create.useMutation();
  return (
    <div className="thom mt-8 h-[calc(100vh_-_17vh)]">
      NO EO ID! (WIP) Create Form Event Organizer!!
      <form>
        <input name="name" />
        {/* {error?.data?.code} */}
      </form>
    </div>
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
