import { useRouter } from "next/router"

export default function VisitorByIdPage() {
  const { query } = useRouter()
  const visitorId = query.id

  console.log({ visitorId })

  return (
    <div>
      <h1>VisitorByIdPage</h1>
      <div>
        {/* // TODOS: */}
        <h1>TODOS</h1>
        <ul>
          {/* // TODOS: EVENT */}
          <li>Event Title</li>
          <li>Event Date</li>
          <li>Event Venue</li>
          <li>Event Organizer Name</li>

          {/* // TODOS: TICKET */}
          <li>Ticket Category</li>
          <li>Ticket Price</li>
          <li>Ticket Status</li>

          {/* // TODOS: VISITOR */}
          <li>Visitor Name</li>
          <li>Visitor Phone</li>
          <li>Visitor email</li>
          <li>isCheckIn</li>
          <li>checkinDate</li>
        </ul>
      </div>
      {JSON.stringify(visitorId, null, 4)}
    </div>
  )
}
