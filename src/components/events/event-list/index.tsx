import { api } from "~/src/utils/api"
import { columnsEvent } from "./columnsEvent"
import { EventTable } from "./event-table"
import { LoadingSpinner } from "~/components/loading"

export function EventList(): JSX.Element {
  const { data: events, status } = api.event.getAll.useQuery()
  if (status !== "success") return <LoadingSpinner />
  return (
    <div className="py-4">
      <EventTable data={events} columns={columnsEvent} />
    </div>
  )
}
