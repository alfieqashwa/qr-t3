import { LoadingSpinner } from "~/components/loading"
import { api } from "~/src/utils/api"
import { columnsVisitor } from "./columns-visitor"
import { VisitorTable } from "./visitor-table"

export function VisitorList(): JSX.Element {
  const { data: visitors, status } = api.visitor.getAll.useQuery()
  if (status === "loading") return <LoadingSpinner />
  return (
    <div className="py-4">
      {status === "success" && (
        <VisitorTable data={visitors} columns={columnsVisitor} />
      )}
    </div>
  )
}
