import { EventOrganizer, Role } from "@prisma/client";
import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTime from "dayjs/plugin/relativeTime";
import { AdminAndDewaOnly } from "../Authed/AdminAndDewaOnly";
import type { RouterOutputs } from "@/src/utils/api";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";

dayjs.extend(relativeTime);

type UserInfoProps = {
  teams?: RouterOutputs["user"]["getAll"];
};

export function TeamInfo({ teams }: UserInfoProps) {
  // const createdAt = dayjs(eo?.createdAt).format("dddd, DD MMMM YYYY, HH:mm");
  // const updateAt = dayjs().to(dayjs(eo?.updatedAt));

  const { data } = useSession();

  console.log(`TEAMS::: `, JSON.stringify(teams, null, 2));
  return (
    <div className="mx-auto w-full">
      <h1 className="text-2xl font-semibold capitalize leading-none tracking-tight">
        Team
      </h1>
      <h4 className="mt-2 text-slate-400">Information of your team members.</h4>
      <div className="mt-4 border-t-2 border-slate-800"></div>
      <section className="mt-4 rounded-md border-4 border-slate-800 p-4">
        <table className="w-full table-auto text-xs font-semibold">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm">Name</th>
              <th className="px-4 py-2 text-left text-sm">Email</th>
              <th className="px-4 py-2 text-center text-sm">Role</th>
              <th className="sr-only">Edit</th>
              <th className="sr-only">Delete</th>
            </tr>
          </thead>
          <tbody>
            {teams?.map((team) => (
              <tr className="divide-y divide-slate-700" key={`ID-${team.id}`}>
                <td className="px-4 py-2 text-sm capitalize">{team.name}</td>
                <td className="px-4 py-2">{team.email}</td>
                <td className="px-4 py-2 text-center text-yellow-500">
                  {team.role}
                </td>
                <AdminAndDewaOnly>
                  <td className="py-2 text-right">
                    <Button variant="outline" className="text-xs font-semibold">
                      Edit User
                    </Button>
                  </td>
                  <td className="py-2 pr-4 text-right">
                    <Button
                      variant="destructive"
                      className="text-xs font-semibold"
                    >
                      Delete User
                    </Button>
                  </td>
                </AdminAndDewaOnly>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
