import { api } from "~/src/utils/api"
import { LoadingSpinner } from "../../loading"
import { VisitorTable } from "./visitor-table"
import { columnsVisitor } from "./columnsVisitor"
// import { columnsEvent } from "./columnsEvent"
// import { EventTable } from "./event-table"
// import { LoadingSpinner } from "../../loading"

export function VisitorList(): JSX.Element {
  const visitors = api.visitor.getAll.useQuery()
  if (visitors.status !== "success") return <LoadingSpinner />
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <VisitorTable data={visitors.data} columns={columnsVisitor} />
      <pre>{JSON.stringify(visitors.data, null, 2)}</pre>
    </div>
  )
}
