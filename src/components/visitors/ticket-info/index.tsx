import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/src/components/ui/card"
import { type RouterOutputs } from "~/src/utils/api"
import { Wrapper } from "./ticket-wrapper"

type TicketInfoProps = {
  ticket: RouterOutputs["ticket"]["getAllById"]
  ticketId: string
}
export const TicketInfo = ({ ticket, ticketId }: TicketInfoProps) => {
  return (
    <Card className="thom min-h-screen min-w-fit py-8">
      <CardHeader className="text-center">
        <CardTitle className="md:text-xl">Ticket Information</CardTitle>
        <CardDescription className="md:text-lg">
          Ticket ID: {ticket?.id}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Wrapper title="Event">
          <p className="uppercase">{ticket?.event?.title}</p>
          <p>
            {ticket?.event?.date &&
              format(ticket.event.date, "PPPP", { locale: id })}
          </p>
          <p>
            <span className="capitalize">{ticket?.event?.venue}</span>
          </p>
          <p>
            <span className="uppercase">{ticket?.eventOrganizer?.name}</span>
          </p>
        </Wrapper>

        <Wrapper title="Ticket Info" className="mt-2">
          <p>
            Category: <span className="uppercase">{ticket?.category}</span>
          </p>
          <p>Price: {ticket?.price}</p>
          <p>Status: {ticket?.status}</p>
        </Wrapper>

        <Wrapper title="Visitor" className="mt-2">
          {ticket?.visitors
            .filter((t) => t.ticketId === ticketId)
            .map((t) => (
              <ul key={t.id} className="flex flex-col items-center text-sm">
                <li className="capitalize">{t.name}</li>
                <li>{t.phone}</li>
                <li>{t.email}</li>
                {/* // TODOS: CONFIG CHECK-IN */}
                <li>isCheckIn: {t.isCheckIn.toString()}</li>
                <li>checkinDate: {t.checkInDate?.toString() ?? "-"}</li>
              </ul>
            ))}
        </Wrapper>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
        {/* <pre>{JSON.stringify(ticket, null, 2)}</pre> */}
      </CardFooter>
    </Card>
  )
}
