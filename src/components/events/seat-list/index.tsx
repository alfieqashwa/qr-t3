import { LoadingSpinner } from "~/components/loading"
import { api } from "~/src/utils/api"
import { columnsSeat } from "./columnsSeat"
import { SeatTable } from "./seat-table"

export const SeatList = (): JSX.Element => {
  const seats = api.ticket.getAllNonProfit.useQuery()

  if (seats.status !== "success") return <LoadingSpinner />

  return (
    <div className="py-4">
      <SeatTable data={seats.data} columns={columnsSeat} />
    </div>
  )
}
