import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTime from "dayjs/plugin/relativeTime";
import { AdminOnly } from "~/src/components/authed";
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

  if (eo == null) return null;
  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <HeaderSettings
        title={eo.name}
        subTitle="Information of your Event Organizer"
      />
      <div className="mt-4 border-t-2 border-slate-800"></div>
      <section className="mt-4 rounded-md border-4 border-slate-800 p-4 lg:p-8">
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
              <UpdateEventOrganizerDialog currentEO={eo} />
              <DeleteEventOrganizerDialog id={eo.id} />
            </div>
          </AdminOnly>
        </article>
      </section>
    </div>
  );
}
