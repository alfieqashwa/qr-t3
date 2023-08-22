import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/src/components/ui/card"
import { api, type RouterOutputs } from "~/src/utils/api"
import { Button } from "~/ui/button"
import { ToastAction } from "~/ui/toast"
import { toast } from "~/ui/use-toast"
import { Wrapper } from "./ticket-wrapper"

type TicketInfoProps = {
  ticket: RouterOutputs["ticket"]["getAllById"]
  ticketId: string
}
export const TicketInfo = ({ ticket, ticketId }: TicketInfoProps) => {
  const utils = api.useContext()
  const { mutate, isLoading } = api.visitor.toggleCheck.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Check has been updated.",
      })
      await utils.ticket.getAllById.invalidate()
    },
    onError() {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    },
  })

  const handleCheckIn = (visitorId: string) =>
    mutate({ id: visitorId, isCheckIn: true })

  const handleCheckOut = (visitorId: string) =>
    mutate({ id: visitorId, isCheckIn: false })

  return (
    <Card className="min-h-screen min-w-fit py-8">
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
            .map((v) => (
              <ul key={v.id} className="flex flex-col items-center text-sm">
                <li className="capitalize">{v.name}</li>
                <li>{v.phone}</li>
                <li>{v.email}</li>
                {/* // TODOS: CONFIG CHECK-IN */}
                <li className="mt-8 flex items-center justify-center space-x-6">
                  {/* //? STARTS CHECK-IN */}
                  <Button
                    disabled={isLoading || v.isCheckIn}
                    size="lg"
                    variant={`${v.isCheckIn ? "destructive" : "default"}`}
                    onClick={() => handleCheckIn(v.id)}
                    className="flex items-center justify-center uppercase"
                  >
                    <span className="whitespace-nowrap">Check In</span>
                  </Button>
                  {/* //? ENDS CHECK-IN */}

                  {/* //? STARTS CHECK-OUT */}
                  <Button
                    disabled={isLoading || !v.isCheckIn}
                    size="lg"
                    variant={`${!v.isCheckIn ? "destructive" : "default"}`}
                    onClick={() => handleCheckOut(v.id)}
                    className="flex items-center justify-center uppercase"
                  >
                    <span className="whitespace-nowrap">Check Out</span>
                  </Button>
                  {/* //? ENDS CHECK-OUT */}
                </li>

                <li className="mt-4">
                  checkinDate: {v.checkInDate?.toString() ?? "-"}
                </li>
              </ul>
            ))}
        </Wrapper>
      </CardContent>
    </Card>
  )
}
