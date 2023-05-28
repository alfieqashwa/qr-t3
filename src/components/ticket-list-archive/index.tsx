import { api } from "~/src/utils/api";
import { LoadingSpinner } from "../loading";
import { GenerateNewTicket } from "./GenerateNewTicket";
import { TicketTable } from "./TicketTable";

export function TicketList(): JSX.Element | null {
  const count = api.ticket.count.useQuery();
  const deleteAll = api.ticket.deleteAll.useMutation();
  const { data: tickets, isLoading } = api.ticket.getAll.useQuery();
  if (tickets == null) return null;
  return (
    <div>
      <header className="flex justify-end space-x-4">
        <button
          type="submit"
          onClick={() => deleteAll.mutate()}
          className="bg-red-600 p-2 text-white"
        >
          DELETE_ALL
        </button>
        <p>TOTAL: {count.data}</p>
        <GenerateNewTicket tickets={tickets} />
      </header>
      <div className="mt-4 border-t-2 border-slate-800"></div>
      {isLoading && <LoadingSpinner />}
      {tickets?.length < 1 ? (
        <EmptyData description="There's no ticket has been created." />
      ) : (
        <section className="mt-2 py-4 px-4 lg:px-8 xl:px-12">
          <TicketTable tickets={tickets} />
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
