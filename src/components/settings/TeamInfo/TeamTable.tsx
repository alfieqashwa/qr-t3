import { AdminAndDewaOnly } from "~/components/Authed/AdminAndDewaOnly";
import type { RouterOutputs } from "~/src/utils/api";
import { DeleteTeamDialog } from "./DeleteTeamDialog";
import { UpdateTeamDialog } from "./UpdateTeamDialog";

type TableTeamProps = {
  teams: RouterOutputs["user"]["getAllByEOId"];
};

export function TableTeam({ teams }: TableTeamProps) {
  return (
    <table className="w-full table-auto text-xs font-semibold">
      <thead>
        <tr className="border-b border-slate-700">
          <th className="px-4 pb-4 text-left text-sm">Name</th>
          <th className="px-4 pb-4 text-left text-sm">Email</th>
          <th className="px-4 pb-4 text-center text-sm">Role</th>
          <th className="sr-only">Edit Role</th>
          <th className="sr-only">Delete</th>
        </tr>
      </thead>
      <tbody>
        {teams.map((team) => (
          <tr key={`ID-${team.id}`}>
            <td className="px-4 py-3 text-sm capitalize">{team.name}</td>
            <td className="px-4 py-3">{team.email}</td>
            <td className="px-4 py-3 text-center text-yellow-500">
              {team.role}
            </td>
            <AdminAndDewaOnly>
              <td className="py-3 text-right">
                <UpdateTeamDialog
                  id={team.id}
                  role={team.role}
                  username={team.name}
                />
              </td>
              <td className="py-3 pr-4 text-right">
                <DeleteTeamDialog id={team.id} username={team.name} />
              </td>
            </AdminAndDewaOnly>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
