import type { RouterOutputs } from "~/utils/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/ui/select";

type Props = {
  events: RouterOutputs["event"]["getAll"];
};

export function SelectEvent({ events }: Props): JSX.Element {
  const initialEvent = events.sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { numeric: true })
  )?.[0]?.id;

  return (
    <Select name="eventId" defaultValue={initialEvent}>
      <SelectTrigger className="w-1/2 uppercase">
        <SelectValue placeholder="Select a event" className="capitalize" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {events.map((event) => (
            <SelectItem value={event.id} className="capitalize" key={event.id}>
              {event.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
