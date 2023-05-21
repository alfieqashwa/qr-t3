import type { RouterOutputs } from "~/src/utils/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

type Props = {
  tickets: RouterOutputs["ticket"]["getAll"];
};

export function SelectCategory({ tickets }: Props): JSX.Element {
  const categories = [
    ...new Set(tickets.map((ticket) => ticket.category as string)),
  ];
  console.log({ categories });
  return (
    <Select name="category">
      <SelectTrigger className="w-1/2">
        <SelectValue placeholder="or select a category" />
      </SelectTrigger>
      <SelectContent>
        {/* //! TODO: Select + input combination */}
        <SelectGroup className="space-y-2">
          {categories.map((category, idx) => (
            <SelectItem value={category} className="uppercase" key={idx}>
              {category}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
