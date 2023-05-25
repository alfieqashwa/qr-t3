import { api } from "~/src/utils/api";
import { DataTable } from "./data-table";
import { LoadingSpinner } from "../Loading";
import { columns } from "./columns";
import { GenerateNewTicket } from "./GenerateNewTicket";

export function DataList() {
  const { data: tickets, isLoading, status } = api.ticket.getAll.useQuery();
  return (
    <>
      {isLoading && <LoadingSpinner />}
      <header className="flex justify-end">
        {status === "success" && <GenerateNewTicket tickets={tickets} />}
      </header>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>
        {status === "success" && <DataTable data={tickets} columns={columns} />}
      </div>
    </>
  );
}
