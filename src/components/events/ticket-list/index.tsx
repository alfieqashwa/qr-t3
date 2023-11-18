import { LoadingSpinner } from "~/components/loading"
import { api } from "~/utils/api"
import { columnsTicket } from "./columns-ticket"
import { TicketTable } from "./ticket-table"

export const TicketList = (): JSX.Element => {
  const tickets = api.ticket.getAll.useQuery({ isProfit: true })
  if (tickets.status !== "success") return <LoadingSpinner />
  return (
    <div className="py-4">
      <TicketTable data={tickets.data} columns={columnsTicket} />
    </div>
  )
}
