import { Status } from "@prisma/client";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpCircle,
  ArrowUp,
  CheckCircle2,
  Circle,
  HelpCircle,
  XCircle,
} from "lucide-react";

// export const events = [
//   {
//     value: Event,
//     label: "ColdPlay",
//     icon: Circle,
//   },
//   {
//     value: Status.SOLD,
//     label: "Nirvana",
//     icon: CheckCircle2,
//   },
// ];

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

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

// {
//   value: "in progress",
//   label: "In Progress",
//   icon: ArrowUpCircle,
// },
// {
//   value: "done",
//   label: "Done",
//   icon: CheckCircle2,
// },
// {
//   value: "canceled",
//   label: "Canceled",
//   icon: XCircle,
// },

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownLeft,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUp,
  },
];
