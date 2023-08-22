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
import { Loader2 } from "lucide-react"

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
            .map((t) => (
              <ul key={t.id} className="flex flex-col items-center text-sm">
                <li className="capitalize">{t.name}</li>
                <li>{t.phone}</li>
                <li>{t.email}</li>
                {/* // TODOS: CONFIG CHECK-IN */}
                <li className="mt-8">
                  {isLoading ? (
                    <Button
                      size="lg"
                      disabled
                      className="flex items-center justify-center"
                    >
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={() =>
                        mutate({
                          id: t.id,
                          isCheckIn: !t.isCheckIn,
                        })
                      }
                      className="flex items-center justify-center"
                    >
                      {!t.isCheckIn ? (
                        <span>Check In</span>
                      ) : (
                        <span>Check Out</span>
                      )}
                    </Button>
                  )}
                </li>
                <li className="mt-4">
                  checkinDate: {t.checkInDate?.toString() ?? "-"}
                </li>
              </ul>
            ))}
        </Wrapper>
      </CardContent>
    </Card>
  )
}
