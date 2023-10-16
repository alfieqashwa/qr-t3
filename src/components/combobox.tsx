import { Check, ChevronsUpDown } from "lucide-react"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import type { z } from "zod"
import { cn } from "~/src/utils"
import { Button } from "~/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/ui/command"
import { FormControl } from "~/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "~/ui/popover"
import { ScrollArea } from "~/ui/scroll-area"
import type { updateEventOrganizerSchema } from "../types/schema"

type CommandComboboxProps = {
  datas?: {
    id: string
    name: string
  }[]
  // | RouterOutputs["address"]["provinces"]
  // | RouterOutputs["address"]["regencies"]
  // | RouterOutputs["address"]["districts"]
  // | RouterOutputs["address"]["villages"]
  isLoading: boolean
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  placeholder: string
}

export function CommandCombobox({
  datas,
  isLoading,
  value,
  setValue,
  placeholder,
}: CommandComboboxProps) {
  const [open, setOpen] = useState(false)

  isLoading && <p>Loading...</p>
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "mt-6 w-full justify-between pl-3",
            !value && "text-muted-foreground"
          )}
        >
          {value
            ? datas?.find((data) => data.name === value?.toUpperCase())?.name
            : `Select ${placeholder}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder}...`} />
          <CommandEmpty>No select found.</CommandEmpty>
          <CommandGroup>
            {datas?.map((data) => (
              <CommandItem
                key={data.id}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value?.toUpperCase() === data.name
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
  )
}

type UpdateEventOrganizerSchema = z.infer<typeof updateEventOrganizerSchema>
type CommandComboboxHookFormProps = {
  name:
    | "name"
    | "id"
    | "phone"
    | "province"
    | "regency"
    | "district"
    | "village"
    | "street"
    | "postalCode"
  value: string
  status: "error" | "success" | "loading"
  datas?: {
    id: string
    name: string
  }[]
  form: UseFormReturn<UpdateEventOrganizerSchema, unknown, undefined>
}

export const CommandComboboxHookForm = ({
  name,
  value,
  status,
  datas,
  form,
}: CommandComboboxHookFormProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "mt-6 w-[240px] justify-between whitespace-nowrap pl-3 uppercase",
              !value && "text-muted-foreground"
            )}
          >
            {!!value &&
            status === "success" &&
            datas?.find((p) => p.name.toLowerCase() === value) ? (
              datas?.find((p) => p.name.toLowerCase() === value)?.name
            ) : (
              <span className="capitalize text-muted-foreground">
                Select {name}...
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0">
        <Command>
          <CommandInput placeholder={`Search ${name}...`} />
          <CommandEmpty>No {name} found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-48">
              {status === "success" &&
                datas?.map((p) => (
                  <CommandItem
                    value={p.name}
                    key={p.id}
                    onSelect={() => {
                      form.setValue(`${name}`, p.name.toLowerCase())
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        p.name === value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {p.name}
                  </CommandItem>
                ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
