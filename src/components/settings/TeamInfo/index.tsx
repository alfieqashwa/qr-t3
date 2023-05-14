import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingSpinner } from "~/components/Loading";
import { api } from "~/src/utils/api";
import { CreateNewTeamDialog } from "./CreateNewTeamDialog";
import { TableTeam } from "./TeamTable";

dayjs.extend(relativeTime);

export function TeamInfo() {
  const { data: teams, isLoading } = api.user.getAllByEOId.useQuery();
  const EOName = teams?.[0]?.eventOrganizer?.name;

  if (!!isLoading) return <LoadingSpinner />;
  return (
    <div className="mx-auto w-full">
      <h1 className="text-2xl font-semibold leading-none tracking-tight">
        Team of <span className="capitalize text-amber-400">{EOName}</span>
      </h1>
      <h4 className="mt-2 text-slate-400">Information of your team members</h4>
      <div className="mt-4 border-t-2 border-slate-800"></div>
      {!teams || teams?.length < 1 ? (
        <section className="mt-4 grid h-72 place-items-center rounded-md border-4 border-slate-800 p-4">
          <CreateNewTeamDialog />
        </section>
      ) : (
        <section className="mt-4 rounded-md border-4 border-slate-800 p-4">
          <TableTeam teams={teams} />
          <div className="mt-24 flex justify-end space-x-4">
            <CreateNewTeamDialog />
          </div>
        </section>
      )}
    </div>
  );
}
