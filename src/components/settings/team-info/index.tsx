import { LoadingSpinner } from "~/components/loading"
import { api } from "~/utils/api"
import { columnsTeam } from "./columns-team"
import { TeamTable } from "./team-table"

export function TeamList(): JSX.Element {
  const teams = api.user.getAllByEOIdAdminRole.useQuery()
  if (teams.status !== "success") return <LoadingSpinner />
  return (
    <div className="py-4">
      <TeamTable data={teams.data} columns={columnsTeam} />
    </div>
  )
}
