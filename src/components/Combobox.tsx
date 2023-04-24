"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/src/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { RouterOutputs } from "@/utils/api";

type CommandComboboxProps = {
  datas?:
    | RouterOutputs["address"]["getProvinces"]
    | RouterOutputs["address"]["getRegencies"];
  isLoading: boolean;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

export function CommandCombobox({
  datas,
  isLoading,
  value,
  setValue,
}: CommandComboboxProps) {
  const [open, setOpen] = React.useState(false);

  isLoading && <p>Loading...</p>;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="mt-6 w-[200px] justify-between"
        >
          {value
            ? datas?.find((data) => data.name === value.toUpperCase())?.name
            : "Select province..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] bg-slate-900 p-0">
        <Command>
          <CommandInput placeholder="Search province..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {datas?.map((data) => (
              <CommandItem
                key={data.id}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.toUpperCase() === data.name
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {data.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
