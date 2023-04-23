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

type ProvinceProps = {
  provinces?: RouterOutputs["address"]["getProvinces"];
  isLoading: boolean;
};

export function ProvincesCombobox({ provinces, isLoading }: ProvinceProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");

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
          {name
            ? provinces?.find(
                (province) => province.name === name.toUpperCase()
              )?.name
            : "Select province..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] bg-slate-900 p-0">
        <Command>
          <CommandInput placeholder="Search province..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {provinces?.map((province) => (
              <CommandItem
                key={province.id}
                onSelect={(currentValue) => {
                  setName(currentValue === name ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    name.toUpperCase() === province.name
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {province.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
