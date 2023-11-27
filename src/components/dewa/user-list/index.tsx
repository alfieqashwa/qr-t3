import { LoadingSpinner } from "~/components/loading"
import { api } from "~/utils/api"
import { columnsUser } from "./columns-user"
import { UserTable } from "./user-table"

export function Userlist(): JSX.Element {
  const { data: getAll, status } = api.user.getAllDewaRole.useQuery()
  if (status !== "success") return <LoadingSpinner />
  return (
    <div className="py-4">
      <UserTable data={getAll} columns={columnsUser} />
    </div>
  )
}
