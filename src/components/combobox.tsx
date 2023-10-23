import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form"
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

type Data = { id: string; name: string }
type CommandComboboxProps<TValue extends FieldValues> = {
  name: keyof TValue
  value: string
  status: "error" | "success" | "loading"
  datas?: Data[]
  form: UseFormReturn<TValue, unknown, undefined>
}

export const CommandCombobox = <TValue extends FieldValues>({
  name,
  value,
  status,
  datas,
  form,
}: CommandComboboxProps<TValue>) => {
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
                Select {name as string}...
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0">
        <Command>
          <CommandInput placeholder={`Search ${name as string}...`} />
          <CommandEmpty>No {name as string} found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-48">
              {status === "success" &&
                datas?.map((p) => (
                  <CommandItem
                    value={p.name}
                    key={p.id}
                    onSelect={() => {
                      form.setValue(
                        name as Path<TValue>,
                        p.name.toLowerCase() as PathValue<TValue, Path<TValue>>
                      )
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
