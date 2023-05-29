import type { RouterOutputs } from "~/utils/api";
import { AddNewEvent } from "./add-new-event";
import { columnsEvent } from "./columnsEvent";
import { EventTable } from "./event-table";

type EventListProps = {
  events: RouterOutputs["event"]["getAll"];
};

export function EventList({ events }: EventListProps): JSX.Element {
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here&apos;s a list of your events!
        </p>
        <AddNewEvent />
      </div>
      <EventTable data={events} columns={columnsEvent} />
    </div>
  );
}
