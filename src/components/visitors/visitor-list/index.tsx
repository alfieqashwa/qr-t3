import { api } from "~/src/utils/api"
import { LoadingSpinner } from "../../loading"
// import { columnsEvent } from "./columnsEvent"
// import { EventTable } from "./event-table"
// import { LoadingSpinner } from "../../loading"

export function VisitorList(): JSX.Element {
  const { data: visitors, status } = api.visitor.getAll.useQuery()

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <h2>Visitor List</h2>
      {status === "loading" && <LoadingSpinner />}
      {status === "success" && <pre>{JSON.stringify(visitors, null, 2)}</pre>}
    </div>
  )
}
