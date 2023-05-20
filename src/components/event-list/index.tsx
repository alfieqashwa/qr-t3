import { api } from "~/src/utils/api";
import { AddNewEvent } from "./AddNewEvent";
import EventCard from "./event-card";
import { LoadingSpinner } from "../Loading";

export function EventList(): JSX.Element {
  const { data: events, isLoading } = api.event.getAll.useQuery();
  return (
    <div>
      <header className="flex justify-end">
        <AddNewEvent />
      </header>
      <div className="mt-4 border-t-2 border-slate-800"></div>
      {isLoading && <LoadingSpinner />}
      {events && events?.length < 1 ? (
        <EmptyData description="There's no event has been created." />
      ) : (
        <section className="mt-2 grid h-auto grid-cols-1 gap-4 py-4 sm:grid-cols-2 lg:mt-0 lg:gap-8 lg:py-8 xl:grid-cols-1">
          {events?.map((event) => (
            <EventCard event={event} key={event.id} />
          ))}
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
