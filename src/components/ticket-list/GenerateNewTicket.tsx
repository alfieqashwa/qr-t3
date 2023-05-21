import { FilePlus2, Loader2 } from "lucide-react";
import { useState } from "react";
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
import { SelectEvent } from "./SelectEvent";
import { SelectCategory } from "./SelectCategory";

type Props = {
  tickets: RouterOutputs["ticket"]["getAll"];
};

export function GenerateNewTicket({ tickets }: Props) {
  const [open, setOpen] = useState(false);
  const utils = api.useContext();

  // const categories = tickets.map((ticket) => ticket.categories);

  const { data: events } = api.event.getAll.useQuery();

  const { mutate, isLoading, error } = api.ticket.generate.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your form has been created.",
      });
      await utils.ticket.getAll.invalidate();
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
    const qty = formData.get("qty")?.toString().toLowerCase() as string;
    const category = formData
      .get("category")
      ?.toString()
      .toLowerCase() as string;
    const price = formData.get("price")?.toString().toLowerCase() as string;
    const eventId = formData.get("eventId") as string;

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
          <DialogTitle>Add New Event</DialogTitle>
          <DialogDescription>
            Create new event here. Click Add Event when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Qty */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="title">Qty</Label>
            <Input id="qty" name="qty" type="number" className="capitalize" />
            {error?.data?.zodError?.fieldErrors.qty && (
              <span className="text-xs text-destructive">
                {error?.data?.zodError?.fieldErrors.qty}
              </span>
            )}
          </div>
          {/* Category */}
          <div className="flex flex-col space-y-1.5">
            {/* //! TODO: Select + input combination */}
            <Label htmlFor="location">Category</Label>
            <Input
              id="category"
              name="category"
              placeholder="create new one..."
              className="uppercase placeholder:lowercase"
            />
            {error?.data?.zodError?.fieldErrors.category && (
              <span className="text-xs text-destructive">
                {error?.data?.zodError?.fieldErrors.category}
              </span>
            )}
            <SelectCategory tickets={tickets} />
            {/* Price */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="location">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                className="capitalize"
              />
              {error?.data?.zodError?.fieldErrors.price && (
                <span className="text-xs text-destructive">
                  {error?.data?.zodError?.fieldErrors.price}
                </span>
              )}
            </div>
          </div>
          {/* Select */}
          {!!events && <SelectEvent events={events} />}
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
                Add Event
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
