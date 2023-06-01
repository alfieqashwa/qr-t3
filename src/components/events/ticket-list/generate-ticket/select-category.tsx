import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/ui/select";

type Props = {
  categories: string[];
  disabled: boolean;
};

export function SelectCategory({ categories, disabled }: Props): JSX.Element {
  return (
    <Select name="category-selected" disabled={disabled}>
      <SelectTrigger className="w-1/2 uppercase">
        <SelectValue placeholder="or select a category" className="lowercase" />
      </SelectTrigger>
      <SelectContent>
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
