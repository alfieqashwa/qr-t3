import type { User } from "@prisma/client";
import { Loader2, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
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
import type { RouterOutputs } from "~/src/utils/api";
import { Button } from "~/ui/button";
import { api } from "~/utils/api";
import { wait } from "~/utils/wait";

type ProfileImageProps = {
  profile: RouterOutputs["user"]["me"];
};

export function ProfileImage({ profile }: ProfileImageProps) {
  const { image, name, imageUpdate } = profile as User;
  const [open, setOpen] = useState(false);

  const utils = api.useContext();
  const { toast } = useToast();

  const { mutate, isLoading } = api.user.removeImageUpdate.useMutation({
    async onSuccess() {
      // delete user from team
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Success removed your updated image.",
      });
      await utils.user.me.invalidate();
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
    mutate();
  };

  if (typeof image !== "string" || typeof name !== "string")
    return (
      <div className="rounded-full p-4 ring-4 ring-amber-300 ring-offset-2 ring-offset-slate-600">
        <UserIcon size={128} />
      </div>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          disabled={!imageUpdate}
          className="relative h-28 w-28 focus:outline-none disabled:cursor-not-allowed lg:h-36 lg:w-36"
        >
          <Image
            src={(imageUpdate as string) || image}
            alt={name}
            fill
            className="rounded-full ring-4 ring-amber-300 ring-offset-2 ring-offset-slate-100"
          />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-1/2">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Delete Your Image?</DialogTitle>
            <DialogDescription asChild>
              <p>
                You can&apos;t undo this changes. Click delete when you&apos;re
                sure.
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
