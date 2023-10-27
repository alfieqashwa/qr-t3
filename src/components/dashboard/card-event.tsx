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
  profit: boolean
  venue: string
  tickets: Ticket[]
  visitors: VisitorProps[]
}

export function CardEvent(props: CardEventProps) {
  const { title, venue, date, profit, tickets, visitors } = props

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
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="capitalize">{title}</CardTitle>
            <div className="mt-2 font-bold capitalize">
              <CardDescription>Date: {formattedDate}</CardDescription>
              <CardDescription>Venue: {venue}</CardDescription>
            </div>
          </div>
          <div className="text-right">
            {profit ? (
              <>
                <CardDescription>Total Omzet</CardDescription>
                <CardTitle className="text-xl">{totalPrice(value)}</CardTitle>
              </>
            ) : (
              <CardDescription className="text-primary">
                Non-Profit Event
              </CardDescription>
            )}
            <CardDescription className="mt-1">Total Ticket</CardDescription>
            <CardTitle className="text-xl">{totalTicket(value)}</CardTitle>
            <CardDescription className="mt-1">Total Visitor</CardDescription>
            <CardTitle className="text-xl">{totalVisitor(value)}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
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
