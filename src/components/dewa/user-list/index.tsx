import { LoadingSpinner } from "~/components/loading"
import { api } from "~/utils/api"
import { columnsUser } from "./columns-user"
import { UserTable } from "./user-table"

export function Userlist(): JSX.Element {
  const getAllUsers = api.user.getAllUsers.useQuery()
  if (getAllUsers.status !== "success") return <LoadingSpinner />
  return (
    <div className="py-4">
      <UserTable data={getAllUsers.data} columns={columnsUser} />
    </div>
  )
}
