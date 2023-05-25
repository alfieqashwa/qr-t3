import { FilePlus2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { RouterOutputs } from "~/src/utils/api";
import { api } from "~/src/utils/api";
import { wait } from "~/src/utils/wait";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ToastAction } from "../ui/toast";
import { toast } from "../ui/use-toast";
import { SelectCategory } from "./SelectCategory";
import { SelectEvent } from "./SelectEvent";

type GenerateNewTicketProps = {
  tickets: RouterOutputs["ticket"]["getAll"];
};

export function GenerateNewTicket({ tickets }: GenerateNewTicketProps) {
  const [open, setOpen] = useState(false);
  const [categoryInput, setCategoryInput] = useState<string>("");
  const [disabled, setDisabled] = useState(false);

  // remove duplicates array
  const categories = [...new Set(tickets.map((ticket) => ticket.category))];
  // console.log({ categories });

  useEffect(() => {
    if (
      categoryInput.length > 0 || // whenever user has not input any
      tickets.length === 0 // if there's no any tickets has been created yet
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [categoryInput.length, tickets.length]);

  const utils = api.useContext();

  const { data: events } = api.event.getAll.useQuery();

  const { mutate, isLoading, error } = api.ticket.generate.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your form has been created.",
      });
      await utils.ticket.getAll.invalidate();
      await utils.ticket.count.invalidate();
      setCategoryInput("");
      await wait().then(() => setOpen(false));
    },

    onError() {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const qty = formData.get("qty")?.toString()?.toLowerCase() as string;
    const categorySelected = formData
      .get("category-selected")
      ?.toString()
      ?.toLowerCase() as string;
    const price = formData.get("price")?.toString()?.toLowerCase() as string;
    const eventId = formData.get("eventId") as string;

    // if user input the existed category, then show the error toast with clear messages.
    const alreadyExists = categories?.includes(categoryInput);
    if (alreadyExists) {
      // and then set the input value back to default
      setCategoryInput("");
      return toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description:
          "The category is already exists. Please use the select option instead.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }

    let category: string;
    if (disabled) {
      category = categoryInput;
    } else {
      category = categorySelected;
    }

    const hasNotEqualPrice = tickets.some(
      (t) =>
        t.eventId === eventId && t.category === category && t.price !== +price
    );

    // Validate an error whenever the same event and category has different price from the existing one.
    if (hasNotEqualPrice) {
      setCategoryInput("");
      //  show the error toast with clear message!
      return toast({
        variant: "destructive",
        title: "Your input price is the different from the exist price. ",
        description: "Don't do that and keep sale your ticket consistently.",
        action: <ToastAction altText="Try again">Change the Price</ToastAction>,
      });
    }

    mutate({
      qty: +qty,
      category,
      price: +price,
      eventId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <FilePlus2
          size={26}
          className="text-amber-200 transition-colors duration-200 ease-in-out hover:cursor-pointer hover:text-amber-300"
        />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Ticket</DialogTitle>
          <DialogDescription>
            Create new ticket here. Click Add Ticket when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Select Event ID */}
          {!!events && <SelectEvent events={events} />}
          {/* Category */}
          <div className="flex flex-col space-y-1.5">
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
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                className="capitalize"
                placeholder="Sale price..."
              />
              {error?.data?.zodError?.fieldErrors.price && (
                <span className="text-xs text-destructive">
                  {error?.data?.zodError?.fieldErrors.price}
                </span>
              )}
            </div>
            {/* Qty */}
            <div className="flex flex-col space-y-1.5">
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
          <DialogFooter>
            <Button
              className="flex flex-row items-center justify-end space-x-2"
              type="button"
              variant="ghost"
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
                Add Ticket
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
