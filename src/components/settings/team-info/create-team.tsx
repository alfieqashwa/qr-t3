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

export function CreateTeam() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          Create New Team
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
        <UserForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

import { Role } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { UserForm } from "./user-form";

export function SelectRole() {
  return (
    <Select name="role">
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Role</SelectLabel>
          <SelectItem value={Role.EDITOR}>{Role.EDITOR}</SelectItem>
          <SelectItem value={Role.OPERATOR}>{Role.OPERATOR}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
