import type { RouterOutputs } from "~/utils/api";
import { columnsEvent } from "./columnsEvent";
import { EventTable } from "./event-table";

type EventListProps = {
  events: RouterOutputs["event"]["getAll"];
};

export function EventList({ events }: EventListProps): JSX.Element {
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <EventTable data={events} columns={columnsEvent} />
    </div>
  );
}
