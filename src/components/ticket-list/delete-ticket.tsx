import type { Status } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ToastAction } from "~/components/ui/toast";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/src/utils/api";
import { wait } from "~/src/utils/wait";

type Props = {
  id: string;
  sku: string;
  status: Status;
};

export function DeleteTicket({ id, sku, status }: Props) {
  const utils = api.useContext();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const { mutate, isLoading } = api.ticket.delete.useMutation({
    async onSuccess() {
      // delete user from team
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Your ticket has been deleted.",
      });
      await utils.ticket.getAll.invalidate();
      /* auto-closed after succeed submit the dialog form */
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
    if (status !== "AVAILABLE") {
      toast({
        variant: "destructive",
        title: "Uh oh! Status ticket issue.",
        description: "Can only delete a ticket with available status.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } else {
      mutate({
        id,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-1/2">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Are You Sure?</DialogTitle>
            <DialogDescription asChild>
              <p className="">
                You can&apos;t undo this changes. Click delete when you&apos;re
                sure to delete ticket
                <span className="px-1.5 font-medium uppercase text-amber-300">
                  {id}
                </span>
                -
                <span className="px-1.5 font-medium uppercase text-amber-300">
                  {sku}
                </span>
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex flex-row items-center justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            {isLoading ? (
              <Button disabled variant="destructive" size="sm">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" variant="destructive" size="sm">
                Delete
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
