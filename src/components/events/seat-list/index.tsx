import { LoadingSpinner } from "~/components/loading"
import { api } from "~/src/utils/api"
import { columnsSeat } from "./columns-seat"
import { SeatTable } from "./seat-table"

export const SeatList = (): JSX.Element => {
  const seats = api.ticket.getAll.useQuery({
    isProfit: false,
  })

  if (seats.status !== "success") return <LoadingSpinner />

  return (
    <div className="py-4">
      <SeatTable data={seats.data} columns={columnsSeat} />
    </div>
  )
}
