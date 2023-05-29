import { Status } from "@prisma/client";
import { CheckCircle2, Circle, XCircle } from "lucide-react";

export const statuses = [
  {
    value: Status.AVAILABLE,
    label: "Available",
    icon: Circle,
  },
  {
    value: Status.SOLD,
    label: "Sold",
    icon: CheckCircle2,
  },
  {
    value: Status.REFUND,
    label: "Refund",
    icon: XCircle,
  },
];
