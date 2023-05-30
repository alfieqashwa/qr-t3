import { LoadingSpinner } from "~/components/loading";
import { api } from "~/utils/api";
import { columnsTicket } from "./columnsTicket";
import { TicketTable } from "./ticket-table";

export const TicketList = (): JSX.Element => {
  const tickets = api.ticket.getAll.useQuery();
  if (tickets.status !== "success") return <LoadingSpinner />;
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <TicketTable data={tickets.data} columns={columnsTicket} />
    </div>
  );
};
