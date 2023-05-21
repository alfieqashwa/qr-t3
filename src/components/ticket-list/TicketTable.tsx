import { format, formatDistance, subDays } from "date-fns";
import { id } from "date-fns/locale";
import { Fragment } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { RouterOutputs } from "~/src/utils/api";

type Props = {
  tickets: RouterOutputs["ticket"]["getAll"];
};

export function TicketTable({ tickets }: Props): JSX.Element {
  return (
    <Table>
      {/* <TableCaption>A list of your recent events.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">ID</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Event</TableHead>
          <TableHead>STATUS</TableHead>
          <TableHead className="w-[100px] text-right">Created At</TableHead>
          <TableHead className="w-[100px] text-right">Updated At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => {
          const createdAt = format(ticket.createdAt, "PP", { locale: id });
          const updatedAt = formatDistance(
            subDays(ticket.updatedAt, 0),
            new Date(),
            {
              addSuffix: true,
            }
          );
          return (
            <TableRow key={ticket.id}>
              <TableCell className="whitespace-nowrap">{ticket.id}</TableCell>
              <TableCell className="whitespace-nowrap font-medium uppercase">
                <Fragment>{ticket.category}</Fragment>
              </TableCell>
              <TableCell className="whitespace-nowrap capitalize">
                {ticket.price}
              </TableCell>
              <TableCell className="whitespace-nowrap capitalize">
                {ticket.event?.title}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {ticket.status}
              </TableCell>
              <TableCell className="whitespace-nowrap text-right">
                {createdAt}
              </TableCell>
              <TableCell className="whitespace-nowrap text-right">
                {updatedAt}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
