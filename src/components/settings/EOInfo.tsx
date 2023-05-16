import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "~/src/utils/api";
import { AdminOnly } from "../Authed/AdminOnly";
import { LoadingSpinner } from "../Loading";
import { DeleteEventOrganizerDialog } from "./DeleteEventOrganizerDialog";
import { UpdateEventOrganizerDialog } from "./UpdateEventOrganizerDialog";

dayjs.extend(relativeTime);

export function EOInfo() {
  const { data: eo, isLoading } = api.eo.read.useQuery();
  const createdAt = dayjs(eo?.createdAt).format("dddd, DD MMMM YYYY, HH:mm");
  const updateAt = dayjs().to(dayjs(eo?.updatedAt));

  if (!!isLoading) return <LoadingSpinner />;
  return (
    <div className="mx-auto w-full">
      <h1 className="text-xl font-semibold capitalize leading-none tracking-tight md:text-2xl">
        {eo?.name}
      </h1>
      <h4 className="mt-2 text-xs font-semibold text-slate-400">
        Information of your Event Organizer
      </h4>
      <div className="mt-4 border-t-2 border-slate-800"></div>
      <section className="mt-4 rounded-md border-4 border-slate-800 p-4 md:p-8">
        {!!eo ? (
          <article className="flex flex-col space-y-6">
            <div>
              <Field label="phone" value={eo.phone} />
              <Field label="street" value={eo.street} />
            </div>
            <div>
              <Field label="province" value={eo.province} />
              <Field label="regency" value={eo.regency} />
              <Field label="district" value={eo.district} />
              <Field label="village" value={eo.village} />
            </div>
            <AdminOnly>
              <div>
                <small className="text-rose-400">
                  ✅ only Dewa and Admin who can see below!
                </small>
                <Field label="Created At" value={createdAt} />
                <Field label="Updated At" value={updateAt} />
                <Field label="ID" value={eo.id} />
              </div>
              <div className="flex justify-end space-x-4">
                <UpdateEventOrganizerDialog
                  id={eo.id}
                  name={eo.name}
                  phone={eo.phone}
                  street={eo.street}
                  postalCode={eo.postalCode}
                />
                <DeleteEventOrganizerDialog id={eo.id} />
              </div>
            </AdminOnly>
          </article>
        ) : null}
      </section>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string | null;
};

function Field(props: FieldProps) {
  const value = props.value ? props.value : "";

  return (
    <div className="space-x-2">
      <small className="text-sm font-medium capitalize md:text-base md:font-semibold">
        {props.label}:
      </small>
      <small className="text-sm font-medium capitalize md:text-base md:font-semibold">
        {value}
      </small>
    </div>
  );
}
