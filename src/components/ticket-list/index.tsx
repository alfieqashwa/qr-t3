import { api } from "~/src/utils/api";
import { LoadingSpinner } from "../Loading";
import { AddNewTicket } from "./AddNewTicket";
import { TicketTable } from "./TicketTable";

export function TicketList(): JSX.Element | null {
  const tickets = api.ticket.getAll.useQuery();
  if (tickets.data == null) return null;
  return (
    <div>
      <header className="flex justify-end">
        <AddNewTicket />
      </header>
      <div className="mt-4 border-t-2 border-slate-800"></div>
      {tickets.isLoading && <LoadingSpinner />}
      {tickets.data?.length < 1 ? (
        <EmptyData description="There's no ticket has been created." />
      ) : (
        <section className="mt-2 py-4 px-4 lg:px-8 xl:px-12">
          <TicketTable tickets={tickets.data} />
        </section>
      )}
    </div>
  );
}

const EmptyData = ({ description }: { description: string }): JSX.Element => (
  <section className="mt-2 grid h-72 place-items-center">
    <h1 className="text-semibold text-amber-300 lg:text-xl">{description}</h1>
  </section>
);
