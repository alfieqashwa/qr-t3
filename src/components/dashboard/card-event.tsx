import { format } from "date-fns"
import { id } from "date-fns/locale"
import dynamic from "next/dynamic"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/ui/card"
import { Label } from "~/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/ui/select"
import type { RouterOutputs } from "~/utils/api"
import { formattedPrice } from "~/utils/formattedPrice"

const PieChartActiveShape = dynamic(
  () => import("~/components/pie-chart-active-shape"),
  {
    ssr: false,
  },
)

type CardEventProps = {
  event: RouterOutputs["event"]["getAllEditorRole"][0]
}

export function CardEvent({ event }: CardEventProps) {
  const { title, venue, date, profit, tickets, categories } = event
  const [categoryId, setCategoryId] = useState("all")

  function totalPrice(categoryId: string) {
    let getTotal
    if (categoryId === "all") {
      getTotal =
        categories.reduce((total, c) => total + c.price, 0) * tickets.length
    } else {
      const selectedCategoryPrice = categories.find((c) => c.id === categoryId)
        ?.price
      if (!selectedCategoryPrice) return
      getTotal = selectedCategoryPrice * tickets.length
    }

    return formattedPrice.format(getTotal)
  }

  function totalTicket(categoryId: string) {
    if (categoryId === "all") {
      return tickets.length
    } else {
      return tickets.filter((t) => t.categoryId === categoryId).length
    }
  }

  const totalStatus = (categoryId: string) => {
    if (categoryId === "all") {
      const available = tickets.filter((t) => t.status === "AVAILABLE").length
      const booked = tickets.filter((t) => t.status === "BOOKED").length
      const purchased = tickets.filter((t) => t.status === "PURCHASED").length
      const refund = tickets.filter((t) => t.status === "REFUND").length
      return [
        { color: "#8884d8", name: "Available", value: available },
        { color: "#ffc658", name: "Booked", value: booked },
        { color: "#82ca9d", name: "Purchased", value: purchased },
        { color: "#ff7300", name: "Refund", value: refund },
      ]
    } else {
      const available = tickets.filter(
        (t) => t.categoryId === categoryId && t.status === "AVAILABLE",
      ).length
      const booked = tickets.filter(
        (t) => t.categoryId === categoryId && t.status === "BOOKED",
      ).length
      const purchased = tickets.filter(
        (t) => t.categoryId === categoryId && t.status === "PURCHASED",
      ).length
      const refund = tickets.filter(
        (t) => t.categoryId === categoryId && t.status === "REFUND",
      ).length
      return [
        { color: "#8884d8", name: "Available", value: available },
        { color: "#ffc658", name: "Booked", value: booked },
        { color: "#82ca9d", name: "Purchased", value: purchased },
        { color: "#ff7300", name: "Refund", value: refund },
      ]
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle className="capitalize">{title}</CardTitle>
            <div className="mt-1 font-bold capitalize">
              <CardDescription>
                {format(date, "PPPP", { locale: id })}
              </CardDescription>
              <CardDescription>in {venue}</CardDescription>
            </div>
          </div>

          <div className="flex flex-col justify-start">
            {profit ? (
              <div className="mt-1 text-right">
                <CardDescription className="font-medium">
                  Total Omzet
                </CardDescription>
                <CardTitle className="text-base text-amber-300">
                  {totalPrice(categoryId)}
                </CardTitle>
              </div>
            ) : (
              <div className="space-y-1 text-right">
                <CardDescription className="font-medium text-white">
                  Non-Profit Event
                </CardDescription>
                <CardTitle className="text-base">&nbsp;</CardTitle>
              </div>
            )}
            <div className="mt-1 text-right">
              <CardDescription className="font-medium">
                Total Ticket
              </CardDescription>
              <CardTitle className="text-base text-amber-300">
                {totalTicket(categoryId)}
              </CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <PieChartActiveShape data={totalStatus(categoryId)} />

        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="category" className="sr-only">
            Category
          </Label>
          {!categories.length ? (
            <h1>&nbsp;</h1>
          ) : (
            <Select onValueChange={setCategoryId} defaultValue={categoryId}>
              <SelectTrigger id="category" className="capitalize">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem className="uppercase" value="all">
                  All
                </SelectItem>
                {categories.map((c) => (
                  <SelectItem className="uppercase" key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
