import { useState } from "react";
import { Button } from "~/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/ui/sheet";
import { CreateTeamForm } from "./create-team-form";

export function CreateTeam() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Create Team
        </Button>
      </SheetTrigger>

      <SheetContent className="sm:max-w-1/2">
        <SheetHeader>
          <SheetTitle>Create New Team</SheetTitle>
          <SheetDescription>
            Create new team for your organization here. Click Create Team when
            you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <CreateTeamForm setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
}
