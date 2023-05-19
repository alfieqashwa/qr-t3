import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingSpinner } from "~/components/Loading";
import { api } from "~/src/utils/api";
import { HeaderSettings } from "../HeaderSettings";
import { CreateNewTeamDialog } from "./CreateNewTeamDialog";
import { TableTeam } from "./TeamTable";

dayjs.extend(relativeTime);

export function TeamInfo(): JSX.Element {
  const teams = api.user.getAllByEOId.useQuery();
  const EOName = teams.data?.[0]?.eventOrganizer?.name as string;

  if (teams.isLoading) return <LoadingSpinner />;
  return (
    <div className="mx-auto w-full">
      <HeaderSettings
        title={EOName}
        subTitle="Information of your team members"
      />
      {!teams?.data || teams.data?.length < 1 ? (
        <section className="mt-4 grid h-72 place-items-center rounded-md border-4 border-slate-800 p-4">
          <CreateNewTeamDialog />
        </section>
      ) : (
        <section className="relative mt-4 min-w-[360px] rounded-md border-4 border-slate-800 p-2 lg:p-4">
          <div className="overflow-y-auto">
            <TableTeam teams={teams.data} />
          </div>
          <div className="absolute -bottom-14 right-0">
            <CreateNewTeamDialog />
          </div>
        </section>
      )}
    </div>
  );
}
