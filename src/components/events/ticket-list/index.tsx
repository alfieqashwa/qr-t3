import type { RouterOutputs } from "~/utils/api";
import { columnsTicket } from "./columnsTicket";
import { TicketTable } from "./ticket-table";

type TicketListProps = {
  tickets: RouterOutputs["ticket"]["getAll"];
};

export const TicketList = ({ tickets }: TicketListProps) => {
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <TicketTable data={tickets} columns={columnsTicket} />
    </div>
  );
};
