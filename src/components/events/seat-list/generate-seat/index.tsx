import { FilePlus2, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "~/ui/button"
import { Input } from "~/ui/input"
import { Label } from "~/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/ui/sheet"
import { ToastAction } from "~/ui/toast"
import { toast } from "~/ui/use-toast"
import { api } from "~/utils/api"
import { wait } from "~/utils/wait"
import { SelectCategory } from "./select-category"
import { SelectEvent } from "./select-event"

export function GenerateSeat(): JSX.Element {
  const seats = api.ticket.getAll.useQuery(
    { isProfit: false },
    {
      select: (seats) => {
        const categories = [...new Set(seats.map((seat) => seat.category))]
        return {
          all: seats,
          categories,
        }
      },
    }
  )

  const [open, setOpen] = useState(false)
  const [categoryInput, setCategoryInput] = useState<string>("")
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    if (seats.status !== "success") return
    if (
      categoryInput.length > 0 || // whenever user has not input any
      seats.data.all.length === 0 // if there's no any tickets has been created yet
    ) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [categoryInput.length, seats.data?.all.length, seats.status])

  const utils = api.useUtils()

  const { data: events } = api.event.getAll.useQuery(undefined, {
    // only renders the non-profit events
    select: (data) => data.filter((d) => !d.profit),
  })

  const { mutate, isLoading, error } =
    api.ticket.generateSeatEditorRole.useMutation({
      async onSuccess() {
        toast({
          title: "Succeed!",
          variant: "default",
          description: "Your seat(s) has been created.",
        })
        await utils.ticket.getAll.invalidate()
        await utils.ticket.categories.invalidate()
        setCategoryInput("")
        await wait().then(() => setOpen(false))
      },

      onError() {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      },
    })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const qty = formData.get("qty")?.toString()?.toLowerCase() as string
    const categorySelected = formData
      .get("category-selected")
      ?.toString()
      ?.toLowerCase() as string
    const eventId = formData.get("eventId") as string

    // if user input the existed category, then show the error toast with clear messages.
    const alreadyExists = seats.data?.categories?.includes(categoryInput)
    if (alreadyExists) {
      // and then set the input value back to default
      setCategoryInput("")
      return toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "The category is already exists. Please use the select input instead.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }

    let category: string
    if (disabled) {
      category = categoryInput
    } else {
      category = categorySelected
    }

    mutate({
      qty: +qty,
      category,
      eventId,
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-2 h-8 whitespace-nowrap"
        >
          <FilePlus2 className="mr-2 h-4 w-4" />
          Generate Seat
        </Button>
      </SheetTrigger>

      <SheetContent className="bg-card">
        <SheetHeader>
          <SheetTitle>Generate New Seat</SheetTitle>
          <SheetDescription>
            Create new seat(s) here. Click Generate Seat when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Select Event ID */}
          <div className="flex flex-col space-y-2 pt-4">
            <Label htmlFor="category-input">Event</Label>
            {!!events && <SelectEvent events={events} />}
          </div>
          {/* Category */}
          <div className="flex flex-col space-y-1.5 pt-4">
            <Label htmlFor="category-input">Category</Label>
            <Input
              type="text"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              placeholder="create new one..."
              className="uppercase placeholder:lowercase"
            />
            {error?.data?.zodError?.fieldErrors.category && (
              <span className="text-xs text-destructive">
                {error?.data?.zodError?.fieldErrors.category}
              </span>
            )}
            <SelectCategory
              categories={seats.data?.categories as string[]}
              disabled={disabled}
            />
            {/* Qty */}
            <div className="flex flex-col space-y-1.5 pt-4">
              <Label htmlFor="title">Qty</Label>
              <Input
                id="qty"
                name="qty"
                type="number"
                className="capitalize placeholder:normal-case"
                placeholder="How many seat(s)..."
              />
              {error?.data?.zodError?.fieldErrors.qty && (
                <span className="text-xs text-destructive">
                  {error?.data?.zodError?.fieldErrors.qty}
                </span>
              )}
            </div>
          </div>
          <SheetFooter className="absolute bottom-8 left-0 right-0 px-6">
            <Button
              className="mt-2 sm:mt-0"
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            {isLoading ? (
              <Button disabled size="sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" size="sm">
                Generate Seat
              </Button>
            )}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
