import type { GetServerSideProps } from "next"
import { type NextPage } from "next"
import { Button } from "~/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

import type { Status } from "@prisma/client"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { getServerSession } from "next-auth/next"
import { Layout } from "~/components/layout"
import { LoadingSpinner } from "~/components/loading"
import { authOptions } from "~/server/auth"
import { api } from "~/utils/api"
import { useState } from "react"
import { formattedInputPriceValue } from "../utils/formattedPriceInputValue"

const title = "Dashboard" as const
const DashboardPage: NextPage = () => {
  const { data, status } = api.dashboard.getAll.useQuery()
  return (
    <Layout title={title}>
      <div className="mb-8 mt-4 text-xl font-semibold text-rose-400">
        {/* // TODOS:  Divide Ticket based on category */}
        {/* // TODOS:  Estimate ticket omzet based on category */}
        <p>TODOS: List all Events</p>
        <p>TODOS: Estimate the total of ticket price of all events</p>
        <p>TODOS: Divide Ticket based on category</p>
        <p>
          TODOS: Estimate the total of ticket price based on ticket category
        </p>
      </div>
      {status === "loading" && <LoadingSpinner />}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
        {status === "success" &&
          data.map((event) => {
            const { id, title, venue, date, tickets } = event
            return (
              <CardEvent
                title={title}
                venue={venue}
                date={date}
                tickets={tickets}
                key={id}
              />
            )
          })}
      </div>
      <div>
        {status === "success" && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
      <div>
        <p>Ticket: {data?.map((d) => d._count.tickets)}</p>
        <p>Visitor: {data?.map((d) => d._count.visitors)}</p>
      </div>
    </Layout>
  )
}

export default DashboardPage

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
          <CardDescription className="whitespace-nowrap text-lg font-bold text-amber-300">
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

// If No Authenticated, then redirect to Home Page. Else, enter this page.
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  // If user has not have EventOrganizerId, then redirect to page "/settings/create-eo"
  if (!session.user.eventOrganizerId) {
    return {
      redirect: {
        destination: "/settings/create-eo",
        permanent: false,
      },
    }
  }

  // If user has EventOrganizerId but as an OPERATOR, then cannot enter this page.
  if (session.user.eventOrganizerId && session.user.role === "OPERATOR") {
    return {
      redirect: {
        destination: "/scanner",
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}
