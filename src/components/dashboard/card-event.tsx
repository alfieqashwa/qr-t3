import type { Status } from "@prisma/client"
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
import { formattedInputPriceValue } from "~/utils/formattedPriceInputValue"

type TicketProps = {
  id: string
  category: string
  price: number
  status: Status
  eventId: string | null
  eventOrganizerId: string
  createdAt: Date
  updatedAt: Date
}

type CardEventProps = {
  title: string
  thumbnail?: string | null
  date: Date
  venue: string
  tickets: TicketProps[]
}

export function CardEvent(props: CardEventProps) {
  const { title, venue, date, tickets } = props

  const formattedDate = format(date, "PPPP", { locale: id })
  const categoryList = [...new Set(tickets.map((t) => t.category))]

  const [value, setValue] = useState("")

  const totalPrice = (category: string) => {
    let getTotal: number

    if (category === "") {
      getTotal = tickets.reduce((total, ticket) => total + ticket.price, 0)
      return formattedInputPriceValue(getTotal)
    }

    getTotal = tickets
      .filter((t) => t.category === category)
      .reduce((total, ticket) => total + ticket.price, 0)
    return formattedInputPriceValue(getTotal)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="uppercase">{title}</CardTitle>
          <CardDescription className="whitespace-nowrap text-base font-bold text-amber-300">
            Omzet: Rp {totalPrice(value)}
          </CardDescription>
        </div>
        <div className="flex justify-between">
          <CardDescription className="capitalize">
            {formattedDate}
          </CardDescription>
          <CardDescription className="capitalize">{venue}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
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
