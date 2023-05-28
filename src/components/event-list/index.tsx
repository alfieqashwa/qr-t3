import type { RouterOutputs } from "~/src/utils/api";
import { AddNewEvent } from "./add-new-event";
import { EventTable } from "./event-table";

type Props = {
  events: RouterOutputs["event"]["getAll"];
};

export function EventList({ events }: Props): JSX.Element {
  return (
    <div>
      <header className="flex justify-end">
        <AddNewEvent />
      </header>
      <div className="mt-4 border-t-2 border-slate-800"></div>
      {events.length < 1 ? (
        <EmptyData description="There's no event has been created." />
      ) : (
        <section className="mt-2 py-4 px-4 lg:px-8 xl:px-12">
          <EventTable events={events} />
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
