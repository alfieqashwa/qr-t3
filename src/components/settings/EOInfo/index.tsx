import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTime from "dayjs/plugin/relativeTime";
import { AdminOnly } from "~/components/Authed/AdminOnly";
import { LoadingSpinner } from "~/components/Loading";
import { HeaderSettings } from "~/components/settings/HeaderSettings";
import { api } from "~/src/utils/api";
import { DeleteEventOrganizerDialog } from "./DeleteEventOrganizerDialog";
import { Field } from "./Field";
import { UpdateEventOrganizerDialog } from "./UpdateEventOrganizerDialog";

dayjs.extend(relativeTime);

export function EOInfo() {
  const { data: eo, isLoading } = api.eo.read.useQuery();
  const createdAt = dayjs(eo?.createdAt).format("dddd, DD MMMM YYYY, HH:mm");
  const updateAt = dayjs().to(dayjs(eo?.updatedAt));

  if (!!isLoading) return <LoadingSpinner />;
  return (
    <div className="mx-auto w-full">
      <HeaderSettings
        title={eo?.name as string}
        subTitle="Information of your Event Organizer"
      />
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
