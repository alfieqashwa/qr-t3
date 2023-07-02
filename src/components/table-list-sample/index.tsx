import { api } from "~/src/utils/api"
import { DataTable } from "./data-table"
import { LoadingSpinner } from "../loading"
import { columns } from "./columns"

export function DataListSample() {
  const { data: tasks, isLoading, status } = api.ticket.tasks.useQuery()
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your tasks for this month!
          </p>
        </div>
      </div>
      {isLoading && <LoadingSpinner />}
      {status === "success" && <DataTable data={tasks} columns={columns} />}
    </div>
  )
}
