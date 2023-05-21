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
import { DeleteEvent } from "./DeleteEvent";

type Props = {
  events: RouterOutputs["event"]["getAll"];
};

export function EventTable({ events }: Props): JSX.Element {
  return (
    <Table>
      {/* <TableCaption>A list of your recent events.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Date</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Ticket</TableHead>
          <TableHead className="sr-only w-[100px] text-right">Update</TableHead>
          <TableHead className="sr-only w-[100px] text-right">Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="whitespace-nowrap">
              {format(event.date, "PPP", { locale: id })}
            </TableCell>
            <TableCell className="whitespace-nowrap font-medium capitalize">
              {event.title}
            </TableCell>
            <TableCell className="whitespace-nowrap capitalize">
              {event.location}
            </TableCell>
            <TableCell className="whitespace-nowrap capitalize">
              500 pcs
            </TableCell>
            <TableCell className="text-right">Update</TableCell>
            <TableCell className="text-right">
              <DeleteEvent id={event.id} title={event.title} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
