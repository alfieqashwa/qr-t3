import { api } from "~/src/utils/api";
import { columnsTeam } from "./columnsTeam";
import { TeamTable } from "./team-table";
import { LoadingSpinner } from "~/components/loading";

export function TeamList(): JSX.Element {
  const teams = api.user.getAllByEOId.useQuery();
  if (teams.status !== "success") return <LoadingSpinner />;
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <TeamTable data={teams.data} columns={columnsTeam} />
    </div>
  );
}
