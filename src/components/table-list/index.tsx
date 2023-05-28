import type { RouterOutputs } from "~/src/utils/api";
import { GenerateNewTicket } from "./generate-new-ticket";
import { columns } from "./columns";
import { DataTable } from "./data-table";

type Props = {
  tickets: RouterOutputs["ticket"]["getAll"];
};

export const DataList = ({ tickets }: Props) => {
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here&apos;s a list of your tasks for this month!
        </p>
        <GenerateNewTicket tickets={tickets} />
      </div>
      <DataTable data={tickets} columns={columns} />
    </div>
  );
};
