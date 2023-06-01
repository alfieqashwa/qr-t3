import { useState } from "react";
import { Button } from "~/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog";
import { CreateTeamForm } from "./create-team-form";

export function CreateTeam() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Create Team
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-1/2">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Create new team for your organization here. Click Create Team when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <CreateTeamForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
