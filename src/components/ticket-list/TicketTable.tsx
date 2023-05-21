import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { RouterOutputs } from "~/src/utils/api";
import { DeleteTicket } from "./DeleteTicket";
import { UpdateTicket } from "./UpdateTicket";

type Props = {
  tickets: RouterOutputs["ticket"]["getAll"];
};

export function TicketTable({ tickets }: Props): JSX.Element {
  return (
    <Table>
      {/* <TableCaption>A list of your recent events.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Date</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="sr-only w-[100px] text-right">Update</TableHead>
          <TableHead className="sr-only w-[100px] text-right">Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id}>
            <TableCell className="whitespace-nowrap">{ticket.id}</TableCell>
            <TableCell className="whitespace-nowrap font-medium capitalize">
              {ticket.category}
            </TableCell>
            <TableCell className="whitespace-nowrap capitalize">
              {ticket.price}
            </TableCell>
            <TableCell className="whitespace-nowrap capitalize">
              500 pcs
            </TableCell>
            <TableCell className="text-right">
              {format(ticket.createdAt, "PPPP", { locale: id })}
            </TableCell>
            <TableCell className="text-right">
              {format(ticket.updatedAt, "PPPP", { locale: id })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
