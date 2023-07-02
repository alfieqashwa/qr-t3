import { api } from "~/src/utils/api"
import { columnsEvent } from "./columnsEvent"
import { EventTable } from "./event-table"
import { LoadingSpinner } from "../../loading"

export function EventList(): JSX.Element {
  const { data: events, status } = api.event.getAll.useQuery()
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      {status === "loading" && <LoadingSpinner />}
      {status === "success" && (
        <EventTable data={events} columns={columnsEvent} />
      )}
    </div>
  )
}
