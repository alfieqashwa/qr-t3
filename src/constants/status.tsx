import { Status } from "@prisma/client"
import { CheckCircle2, Circle, CircleDollarSign, XCircle } from "lucide-react"

export const STATUS = [
  {
    value: Status.AVAILABLE,
    label: "Available",
    icon: Circle,
  },
  {
    value: Status.BOOKED,
    label: "Booked",
    icon: CheckCircle2,
  },
  {
    value: Status.PURCHASED,
    label: "Purchased",
    icon: CircleDollarSign,
  },
  {
    value: Status.REFUND,
    label: "Refund",
    icon: XCircle,
  },
] as const
