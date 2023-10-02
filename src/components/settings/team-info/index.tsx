import { LoadingSpinner } from "~/components/loading"
import { api } from "~/utils/api"
import { columnsTeam } from "./columnsTeam"
import { TeamTable } from "./team-table"

export function TeamList(): JSX.Element {
  const teams = api.user.getAllByEOIdAdminRole.useQuery()
  if (teams.status !== "success") return <LoadingSpinner />
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <TeamTable data={teams.data} columns={columnsTeam} />
    </div>
  )
}
