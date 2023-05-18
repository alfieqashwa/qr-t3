import { AdminOnly } from "~/components/Authed";
import type { RouterOutputs } from "~/src/utils/api";
import { DeleteTeamDialog } from "./DeleteTeamDialog";
import { UpdateTeamDialog } from "./UpdateTeamDialog";

type TableTeamProps = {
  teams: RouterOutputs["user"]["getAllByEOId"];
};

export function TableTeam({ teams }: TableTeamProps): JSX.Element {
  return (
    <table className="w-full table-auto text-xs font-semibold">
      <thead>
        <tr className="border-b border-slate-700">
          <th className="px-4 pb-4 text-left text-sm">Name</th>
          <th className="px-4 pb-4 text-left text-sm">Email</th>
          <th className="px-4 pb-4 text-center text-sm">Role</th>
          <th className="sr-only px-4">Edit Role</th>
          <th className="sr-only px-4">Delete</th>
        </tr>
      </thead>
      <tbody>
        {teams.map((team) => (
          <tr key={`ID-${team.id}`}>
            <td className="whitespace-nowrap px-4 py-3 text-sm capitalize">
              {team.name ?? <PendingStatus />}
            </td>
            <td className="px-4 py-3">{team.email}</td>
            <td className="px-4 py-3 text-center text-yellow-500">
              {team.role}
            </td>
            <AdminOnly>
              <td className="py-3 pr-4 text-right lg:pr-0">
                <UpdateTeamDialog
                  id={team.id}
                  currentRole={team.role}
                  username={team.name}
                />
              </td>
              <td className="py-3 pr-4 text-right">
                <DeleteTeamDialog id={team.id} username={team.name} />
              </td>
            </AdminOnly>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const PendingStatus = () => (
  <pre className="text-xs text-yellow-200">pending status</pre>
);
