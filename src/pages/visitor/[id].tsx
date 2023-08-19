import { useRouter } from "next/router"
import { LoadingSpinner } from "~/src/components/loading"
import { api } from "~/src/utils/api"

export default function VisitorByIdPage() {
  const { query } = useRouter()
  const ticketId = query.id as string

  console.log({ ticketId })
  const { data: ticket, status: ticketStatus } = api.ticket.getAllById.useQuery(
    {
      ticketId
    },
    {
      enabled: !!ticketId,
    }
  )

  return (
    <div>
      {ticketStatus !== "success" ? < LoadingSpinner />
        :
        <div>
          <h1>VisitorByIdPage</h1>
          <div>
            {/* // TODOS: */}
            <ul>
              {/* // TODOS: EVENT */}
              <li>Event Title: {ticket?.event?.title}</li>
              <li>Event Date: {ticket?.event?.date.toString()}</li>
              <li>Event Venue: {ticket?.event?.venue}</li>
              <li>Event Organizer Name: {ticket?.eventOrganizer?.name}</li>

              {/* // TODOS: TICKET */}
              <li>Ticket Category: {ticket?.category}</li>
              <li>Ticket Price: {ticket?.price}</li>
              <li>Ticket Status: {ticket?.status}</li>

              {/* // TODOS: VISITOR */}
              {ticket?.visitors.filter((t) => t.ticketId === ticketId).map((t) => (

                <ul key={t.id}>
                  <li>Visitor Name: {t.name}</li>
                  <li>Visitor Phone: {t.phone}</li>
                  <li>Visitor email: {t.email}</li>
                  <li>isCheckIn: {t.isCheckIn}</li>
                  <li>checkinDate: {t.checkInDate?.toString()}</li>
                </ul>
              ))}
            </ul>

            <pre className="mt-8">
              {JSON.stringify(ticket, null, 2)}
            </pre>
          </div>
        </div>
      }
    </div>
  )
}
