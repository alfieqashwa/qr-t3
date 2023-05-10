import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTime from "dayjs/plugin/relativeTime";
import { AdminAndDewaOnly } from "../Authed/AdminAndDewaOnly";
import { api } from "@/src/utils/api";
import { CreateNewTeamDialog } from "./CreateNewTeamDialog";
import type { EventOrganizer } from "@prisma/client";
import { DeleteTeamDialog } from "./DeleteTeamDialog";
import { UpdateTeamDialog } from "./UpdateTeamDialog";

dayjs.extend(relativeTime);

type Props = {
  eo?: EventOrganizer | null;
};

export function TeamInfo({ eo }: Props) {
  const eventOrganizerId = eo?.id as string;
  const { data: teams, isLoading } = api.user.getAllByEOId.useQuery(undefined, {
    enabled: eventOrganizerId !== undefined,
  });

  if (isLoading) <p>Loading Team....</p>;
  return (
    <div className="mx-auto w-full">
      <h1 className="text-2xl font-semibold leading-none tracking-tight">
        Team of <span className="capitalize text-amber-400">{eo?.name}</span>
      </h1>
      <h4 className="mt-2 text-slate-400">Information of your team members</h4>
      <div className="mt-4 border-t-2 border-slate-800"></div>
      {!teams || teams?.length < 1 ? (
        <section className="mt-4 grid h-72 place-items-center rounded-md border-4 border-slate-800 p-4">
          <CreateNewTeamDialog />
        </section>
      ) : (
        <section className="mt-4 rounded-md border-4 border-slate-800 p-4">
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
          <div className="mt-24 flex justify-end space-x-4">
            <CreateNewTeamDialog />
          </div>
        </section>
      )}
    </div>
  );
}
