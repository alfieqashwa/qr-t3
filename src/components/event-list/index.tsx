import { api } from "~/src/utils/api";
import { AddNewEvent } from "./AddNewEvent";
import { LoadingSpinner } from "../Loading";
import { EventTable } from "./EventTable";

export function EventList(): JSX.Element {
  const events = api.event.getAll.useQuery();
  return (
    <div>
      <header className="flex justify-end">
        <AddNewEvent />
      </header>
      <div className="mt-4 border-t-2 border-slate-800"></div>
      {events.isLoading && <LoadingSpinner />}
      {events.data && events.data?.length < 1 && (
        <EmptyData description="There's no event has been created." />
      )}
      {events.data && (
        <section className="mt-2 py-4 px-4 lg:px-8 xl:px-12">
          <EventTable events={events.data} />
        </section>
      )}
    </div>
  );
}

const EmptyData = ({ description }: { description: string }): JSX.Element => (
  <section className="mt-2 grid h-72 place-items-center">
    <h1 className="text-semibold text-amber-300 lg:text-xl">{description}</h1>
  </section>
);
