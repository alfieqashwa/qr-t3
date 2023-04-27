import type { RouterOutputs } from "@/src/utils/api";
import type { EventOrganizer } from "@prisma/client";
import { Role } from "@prisma/client";
import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTime from "dayjs/plugin/relativeTime";
import { UpdateEventOrganizerDialog } from "./UpdateDialog";

dayjs.extend(relativeTime);

type EOInfoProps = {
  eo?: EventOrganizer | null;
  userRole?: RouterOutputs["user"]["userRole"];
};

export function EOInfo({ eo, userRole }: EOInfoProps) {
  const createdAt = dayjs(eo?.createdAt).format("dddd, DD MMMM YYYY, HH:mm");
  const updateAt = dayjs().to(dayjs(eo?.updatedAt));

  const isDewa = userRole?.role === Role.DEWA;
  const isAdmin = userRole?.role === Role.ADMIN;

  return (
    <div className="mx-auto w-full">
      <h1 className="text-2xl font-semibold capitalize leading-none tracking-tight">
        {eo?.name}
      </h1>
      <h4 className="mt-2 text-slate-400">
        Information of your Event Organizer.
      </h4>
      <div className="mt-4 border-t-2 border-slate-800"></div>
      <section className="mt-4 rounded-md border-4 border-slate-800 p-8">
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
            {!!isDewa ||
              (!!isAdmin && (
                <div>
                  <small className="text-rose-400">
                    ✅ only Dewa and Admin who can see below!
                  </small>
                  <Field label="Created At" value={createdAt} />
                  <Field label="Updated At" value={updateAt} />
                  <Field label="ID" value={eo.id} />
                  <UpdateEventOrganizerDialog
                    id={eo.id}
                    name={eo.name}
                    phone={eo.phone}
                    street={eo.street}
                    postalCode={eo.postalCode}
                  />
                </div>
              ))}
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
      <small className="text-lg font-semibold capitalize">{props.label}:</small>
      <small className="text-lg font-semibold capitalize">{value}</small>
    </div>
  );
}
