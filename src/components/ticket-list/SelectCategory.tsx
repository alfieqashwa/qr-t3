import type { RouterOutputs } from "~/src/utils/api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  tickets: RouterOutputs["ticket"]["getAll"];
  disabled: boolean;
};

export function SelectCategory({ tickets, disabled }: Props): JSX.Element {
  const categories = [...new Set(tickets.map((ticket) => ticket.category))];
  // console.log({ categories });
  return (
    <Select name="category-selected" disabled={disabled}>
      <SelectTrigger className="w-1/2 uppercase">
        <SelectValue placeholder="or select a category" className="lowercase" />
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
