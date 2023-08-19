import { useRouter } from "next/router"
import { LoadingSpinner } from "~/src/components/loading"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/src/components/ui/card"
import { api } from "~/src/utils/api"

export default function VisitorByIdPage() {
  const { query } = useRouter()
  const ticketId = query.id as string

  console.log({ ticketId })
  const { data: ticket, status: ticketStatus } = api.ticket.getAllById.useQuery(
    { ticketId },
    { enabled: !!ticketId }
  )

  if (ticketStatus !== "success") return <LoadingSpinner />

  return (
    <Card className="thom">
      <CardHeader>
        <CardTitle>Ticket Information</CardTitle>
        <CardDescription>Ticket ID: {ticket?.id}</CardDescription>
      </CardHeader>

      <CardContent>
        {/* // TODOS: EVENT */}
        <article className="font-medium">
          <h2 className="text-lg">Event Info</h2>
          <div className="mt-1 text-sm">
            <p>Title: <span className="uppercase">{ticket?.event?.title}</span></p>
            <p>Date: {ticket?.event?.date.toString()}</p>
            <p>Venue: <span className="capitalize">{ticket?.event?.venue}</span></p>
            <p>Event Organizer: <span className="uppercase">{ticket?.eventOrganizer?.name}</span></p>
          </div>
        </article>

        {/* // TODOS: TICKET */}
        <article className="mt-4 font-medium">
          <h2 className="text-lg">Ticket Info</h2>
          <div className="mt-1 text-sm">
            <p>Ticket Category: <span className="uppercase">{ticket?.category}</span></p>
            <p>Ticket Price: {ticket?.price}</p>
            <p>Ticket Status: {ticket?.status}</p>
          </div>
        </article>

        {/* // TODOS: VISITOR */}
        <article className="mt-4 font-medium">
          <h2 className="text-lg">Visitor</h2>
          {ticket?.visitors.filter((t) => t.ticketId === ticketId).map((t) => (
            <ul key={t.id} className="mt-1 text-sm">
              <li>Name: <span className="capitalize">{t.name}</span></li>
              <li>Phone: {t.phone}</li>
              <li>email: {t.email}</li>
              <li>isCheckIn: {t.isCheckIn.toString()}</li>
              <li>checkinDate: {t.checkInDate?.toString() ?? "-"}</li>
            </ul>
          ))}
        </article>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
        {/* <pre>{JSON.stringify(ticket, null, 2)}</pre> */}
      </CardFooter>
    </Card >
  )
}
