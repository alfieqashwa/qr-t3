import type { Ticket, Visitor } from "@prisma/client"
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
import { formattedPrice } from "~/utils/formattedPrice"

type CardEventProps = {
  title: string
  thumbnail?: string | null
  date: Date
  venue: string
  tickets: Ticket[]
  visitors: Visitor[]
}

export function CardEvent(props: CardEventProps) {
  const { title, venue, date, tickets, visitors } = props

  const formattedDate = format(date, "PPPP", { locale: id })
  const categoryList = [...new Set(tickets.map((t) => t.category))]

  const [value, setValue] = useState("")

  const totalPrice = (category: string) => {
    let getTotal: number
    if (category === "") {
      getTotal = tickets.reduce((total, ticket) => total + ticket.price, 0)
      return formattedPrice.format(getTotal)
    }

    getTotal = tickets
      .filter((t) => t.category === category)
      .reduce((total, ticket) => total + ticket.price, 0)
    return formattedPrice.format(getTotal)
  }

  function totalTicket(category: string) {
    if (category === "") {
      return tickets.length
    }
    return tickets.filter((l) => l.category === category).length
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="uppercase">{title}</CardTitle>
        </div>
        <div className="flex justify-between">
          <CardDescription className="font-bold capitalize">
            {formattedDate}
          </CardDescription>
          <CardDescription className="font-bold capitalize">
            {venue}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="space-y-0.5 text-end font-medium">
          <p className="space-x-1">
            <span>Omzet:</span>
            <span className="text-amber-300">{totalPrice(value)}</span>
          </p>
          <p className="space-x-1">
            <span>Total Ticket:</span>
            <span className="text-amber-300">{totalTicket(value)}</span>
          </p>
          <p className="space-x-1">
            <span>Total Visitor:</span>
            <span className="text-amber-300">{visitors.length}</span>
          </p>
        </CardDescription>
        <div className="mt-4 grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="category" className="sr-only">
              Category
            </Label>
            {!categoryList.length ? (
              <p>&nbsp;</p>
            ) : (
              <Select onValueChange={setValue}>
                <SelectTrigger id="category" className="capitalize">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem className="uppercase" value="">
                    All
                  </SelectItem>
                  {categoryList.map((category) => (
                    <SelectItem
                      className="uppercase"
                      value={category}
                      key={category}
                    >
                      {category}
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
