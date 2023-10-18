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
import { formattedInputPriceValue } from "~/utils/formattedPrice"
import { wait } from "~/utils/wait"
import { SelectCategory } from "./select-category"
import { SelectEvent } from "./select-event"

export function GenerateTicket(): JSX.Element {
  const tickets = api.ticket.getAllProfit.useQuery()

  const [open, setOpen] = useState(false)
  const [inputPrice, setInputPrice] = useState("")
  const [categoryInput, setCategoryInput] = useState<string>("")
  const [disabled, setDisabled] = useState(false)

  // remove duplicates array
  const _categories = tickets.data?.map((t) => t.category)
  const categories = [...new Set(_categories)]
  // console.log({ categories });

  useEffect(() => {
    if (tickets.status !== "success") return
    if (
      categoryInput.length > 0 || // whenever user has not input any
      tickets.data.length === 0 // if there's no any tickets has been created yet
    ) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [categoryInput.length, tickets.data?.length, tickets.status])

  const utils = api.useContext()

  const { data: events } = api.event.getAll.useQuery(undefined, {
    // only renders the profit events
    select: (data) => data.filter((d) => !!d.profit),
  })

  const { mutate, isLoading, error } =
    api.ticket.generateEditorRole.useMutation({
      async onSuccess() {
        toast({
          title: "Succeed!",
          variant: "default",
          description: "Your ticket(s) has been created.",
        })
        await utils.ticket.getAllProfit.invalidate()
        await utils.ticket.categories.invalidate()
        setCategoryInput("")
        setInputPrice("")
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
    const alreadyExists = categories?.includes(categoryInput)
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
    // convert price -> float
    const price = parseFloat(inputPrice.toString().replace(/,/g, ""))
    const hasNotEqualPrice = tickets.data?.some(
      (t) =>
        t.eventId === eventId && t.category === category && t.price !== price
    )

    // Validate an error whenever the same event and category has different price from the existing one.
    if (hasNotEqualPrice) {
      setCategoryInput("")
      //  show the error toast with clear message!
      return toast({
        variant: "destructive",
        title: "Your input different price with the existing price.",
        description:
          "Your input different price with the existing price. Don't do that! Please set the price consistently.",
        action: (
          <ToastAction altText="Try again">Change the Price!</ToastAction>
        ),
      })
    }

    mutate({
      qty: +qty,
      category,
      price,
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
          Generate Ticket
        </Button>
      </SheetTrigger>

      <SheetContent position="right" size="content">
        <SheetHeader>
          <SheetTitle>Generate New Ticket</SheetTitle>
          <SheetDescription>
            Create new ticket(s) here. Click Generate Ticket when you&apos;re
            done.
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
            <SelectCategory categories={categories} disabled={disabled} />
            {/* Price */}
            <div className="flex flex-col space-y-1.5 pt-4">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="text"
                className="capitalize"
                placeholder="Sale price..."
                value={formattedInputPriceValue(inputPrice)}
                // onChange={(e) => setPrice(e.target.value.replace(/\D/, ""))}
                onChange={(e) =>
                  setInputPrice(e.target.value.replace(/\D/g, ""))
                }
              />
              {error?.data?.zodError?.fieldErrors.price && (
                <span className="text-xs text-destructive">
                  {error?.data?.zodError?.fieldErrors.price}
                </span>
              )}
            </div>
            {/* Qty */}
            <div className="flex flex-col space-y-1.5 pt-4">
              <Label htmlFor="title">Qty</Label>
              <Input
                id="qty"
                name="qty"
                type="number"
                className="capitalize placeholder:normal-case"
                placeholder="How many ticket(s)..."
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
                Generate Ticket
              </Button>
            )}
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
