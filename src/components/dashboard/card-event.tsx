import { format } from "date-fns"
import { id } from "date-fns/locale"
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="capitalize">{title}</CardTitle>
            <div className="mt-2 font-bold capitalize">
              <CardDescription>
                Date: {format(date, "PPPP", { locale: id })}
              </CardDescription>
              <CardDescription>Venue: {venue}</CardDescription>
            </div>
          </div>
          <div className="text-right">
            {profit ? (
              <>
                <CardDescription>Total Omzet</CardDescription>
                <CardTitle className="text-xl">
                  {totalPrice(categoryId)}
                </CardTitle>
              </>
            ) : (
              <CardDescription className="text-primary">
                Non-Profit Event
              </CardDescription>
            )}
            <CardDescription className="mt-1">Total Ticket</CardDescription>
            <CardTitle className="text-xl">{totalTicket(categoryId)}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-4 grid w-full items-center gap-4">
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
        </div>
      </CardContent>
    </Card>
  )
}
