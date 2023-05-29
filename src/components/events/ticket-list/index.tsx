import type { RouterOutputs } from "~/utils/api";
import { GenerateNewTicket } from "./generate-new-ticket";
import { columnsTicket } from "./columns";
import { TicketTable } from "./ticket-table";

type Props = {
  tickets: RouterOutputs["ticket"]["getAll"];
};

export const TicketList = ({ tickets }: Props) => {
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here&apos;s a list of your tickets for this month!
        </p>
        <GenerateNewTicket tickets={tickets} />
      </div>
      <TicketTable data={tickets} columns={columnsTicket} />
    </div>
  );
};
