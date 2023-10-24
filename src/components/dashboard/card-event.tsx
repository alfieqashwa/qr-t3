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

type VisitorProps = Visitor & { ticket: Ticket }

type CardEventProps = {
  title: string
  thumbnail?: string | null
  date: Date
  venue: string
  tickets: Ticket[]
  visitors: VisitorProps[]
}

export function CardEvent(props: CardEventProps) {
  const { title, venue, date, tickets, visitors } = props

  const formattedDate = format(date, "PPPP", { locale: id })
  const categoryList = [...new Set(tickets.map((t) => t.category))]

  const [value, setValue] = useState("")

  const totalPrice = (category: string) => {
    let getTotal: number
    if (category === "") {
      getTotal = tickets.reduce((total, ticket) => {
        if (ticket.price !== null) {
          return total + ticket.price
        } else {
          return total
        }
      }, 0)
      return formattedPrice.format(getTotal)
    }

    getTotal = tickets
      .filter((t) => t.category === category)
      .reduce((total, ticket) => {
        if (ticket.price !== null) {
          return total + ticket.price
        } else {
          return total
        }
      }, 0)
    return formattedPrice.format(getTotal)
  }

  function totalTicket(category: string) {
    if (category === "all") {
      return tickets.length
    } else {
    }
    return tickets.filter((l) => l.category === category).length
  }

  function totalVisitor(category: string) {
    if (category === "all") {
      return visitors.length
    }
    return visitors.filter((v) => v.ticket.category === category).length
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
        <CardDescription className="space-x-1 space-y-0.5 text-end font-medium">
          <span>Omzet:</span>
          <span className="text-amber-300">{totalPrice(value)}</span>
        </CardDescription>
        <CardDescription className="space-x-1 space-y-0.5 text-end font-medium">
          <span>Total Ticket:</span>
          <span className="text-amber-300">{totalTicket(value)}</span>
        </CardDescription>
        <CardDescription className="space-x-1 space-y-0.5 text-end font-medium">
          <span>Total Visitor:</span>
          <span className="text-amber-300">{totalVisitor(value)}</span>
        </CardDescription>
        <div className="mt-4 grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="category" className="sr-only">
              Category
            </Label>
            {!categoryList.length ? (
              <h1>&nbsp;</h1>
            ) : (
              <Select onValueChange={setValue}>
                <SelectTrigger id="category" className="capitalize">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem className="uppercase" value="all">
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
