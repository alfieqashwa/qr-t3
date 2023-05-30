import { api } from "~/src/utils/api";
import { columnsEvent } from "./columnsEvent";
import { EventTable } from "./event-table";
import { LoadingSpinner } from "../../loading";

export function EventList(): JSX.Element {
  const events = api.event.getAll.useQuery();
  if (events.status !== "success") return <LoadingSpinner />;
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <EventTable data={events.data} columns={columnsEvent} />
    </div>
  );
}
