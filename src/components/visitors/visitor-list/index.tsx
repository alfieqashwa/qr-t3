import { LoadingSpinner } from "~/components/loading"
import { api } from "~/src/utils/api"
import { columnsVisitor } from "./columnsVisitor"
import { VisitorTable } from "./visitor-table"

export function VisitorList(): JSX.Element {
  const visitors = api.visitor.getAll.useQuery()
  if (visitors.status !== "success") return <LoadingSpinner />
  return (
    <div className="py-4">
      <VisitorTable data={visitors.data} columns={columnsVisitor} />
      {/* <pre>{JSON.stringify(visitors.data, null, 2)}</pre> */}
    </div>
  )
}
