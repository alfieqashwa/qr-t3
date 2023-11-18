import { format } from "date-fns"
import { id } from "date-fns/locale"
import { useRouter } from "next/router"
import { CountdownTimer } from "~/components/countdownTimer"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { api, type RouterOutputs } from "~/src/utils/api"
import { Button } from "~/ui/button"
import { ToastAction } from "~/ui/toast"
import { toast } from "~/ui/use-toast"
import { formattedPrice } from "~/utils/formattedPrice"
import { Wrapper } from "./ticket-wrapper"

type TicketInfoProps = {
  ticket: RouterOutputs["ticket"]["getAllByIdOperatorRole"]
}
export const TicketInfo = ({ ticket }: TicketInfoProps) => {
  const router = useRouter()
  const utils = api.useUtils()
  const { mutate, isLoading, variables } =
    api.visitor.toggleCheckOperatorRole.useMutation({
      async onSuccess() {
        toast({
          title: "Succeed!",
          variant: "default",
          description: `The check-${
            variables?.isCheckIn ? "in" : "out"
          } has been successfully updated.`,
        })
        await utils.ticket.getAllByIdOperatorRole.invalidate()
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

  function handleCheckIn(visitorId: string) {
    mutate({ id: visitorId, isCheckIn: true, checkInDate: new Date() })
  }

  function handleCheckOut(visitorId: string) {
    mutate({ id: visitorId, isCheckIn: false, checkOutDate: new Date() })
  }

  const isTodaysEventYet =
    ticket?.event?.date &&
    ticket.event.date.toDateString() === new Date().toDateString()

  return (
    <Card className="min-h-screen min-w-fit px-2 py-8 sm:px-6 lg:px-12">
      <CardHeader className="text-center">
        <CardTitle className="md:text-xl">Ticket Information</CardTitle>
        <CardDescription className="md:text-lg">
          Ticket ID: {ticket?.id}
        </CardDescription>
        {ticket?.ticketNumber && (
          <CardDescription className="md:text-lg">
            Ticket No: {ticket?.ticketNumber}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="rounded-xl border-2 py-6 shadow-xl">
        <Wrapper title="Event">
          <p className="uppercase text-amber-300">
            {ticket?.event?.title}
            <span className="px-1 lowercase">
              {ticket?.event?.profit ? "(profit)" : "(non-profit)"}
            </span>
          </p>
          <p>
            {ticket?.event?.date &&
              format(ticket.event.date, "PPPP", { locale: id })}
          </p>
          <p>
            <span>Venue: </span>
            <span className="capitalize">{ticket?.event?.venue}</span>
          </p>
          <p>
            <span>Event Organizer: </span>
            <span className="uppercase text-amber-300">
              {ticket?.event?.eventOrganizer.name}
            </span>
          </p>
        </Wrapper>

        <Wrapper title="Ticket Info" className="mt-2">
          <p>
            <span>Category: </span>
            <span className="uppercase text-amber-300">{ticket?.category}</span>
          </p>
          {ticket?.event?.profit && (
            <p>
              <span>Price: </span>
              <span className="text-amber-300">
                {formattedPrice.format(ticket?.price as number)}
              </span>
            </p>
          )}
          <p>
            <span>Status: </span>
            <span className="font-bold uppercase text-amber-300">
              {ticket?.status.toString()}
            </span>
          </p>
        </Wrapper>

        <Wrapper title="Visitor" className="mt-2">
          <div className="flex flex-col items-center">
            <p className="capitalize">
              <span>Name: </span>
              <span className="text-amber-300">{ticket?.visitor?.name}</span>
            </p>
            <p>
              <span>Phone: </span>
              <span className="text-amber-300">{ticket?.visitor?.phone}</span>
            </p>
            <p>
              <span>Email: </span>
              <span className="text-amber-300">{ticket?.visitor?.email}</span>
            </p>
            {!isTodaysEventYet ? ( // TODOS: remove exclamation-mark when production is ready!
              <section>
                <div className="mt-4 text-center text-xl font-bold">
                  <p>Today is not the Event Date</p>
                  <div className="m-2 text-xs text-primary">
                    <p>Button Check-In & Check-Out should be disabled</p>
                    <p>But for testing development purpose, we enabled them.</p>
                  </div>
                  {ticket?.event?.date && (
                    <CountdownTimer date={ticket.event?.date} />
                  )}
                  <p className="text-base text-rose-400">
                    TODOS: Setup Start & End Event Time
                  </p>
                </div>
                <div className="mt-8 flex items-center justify-center space-x-6">
                  <Button
                    disabled={isLoading || ticket?.visitor?.isCheckIn}
                    size="lg"
                    variant={`${
                      ticket?.visitor?.isCheckIn ? "destructive" : "default"
                    }`}
                    onClick={() => handleCheckIn(ticket?.visitor?.id as string)}
                    className="flex items-center justify-center uppercase"
                  >
                    <span className="whitespace-nowrap">Check In</span>
                  </Button>
                  <Button
                    disabled={isLoading || !ticket?.visitor?.isCheckIn}
                    size="lg"
                    variant={`${
                      !ticket?.visitor?.isCheckIn ? "destructive" : "default"
                    }`}
                    onClick={() =>
                      handleCheckOut(ticket?.visitor?.id as string)
                    }
                    className="flex items-center justify-center uppercase"
                  >
                    <span className="whitespace-nowrap">Check Out</span>
                  </Button>
                </div>

                <div className="mt-4 text-center">
                  <p>
                    Check In:{" "}
                    <span className="text-amber-300">
                      {!!ticket?.visitor?.checkInDate
                        ? format(ticket.visitor?.checkInDate, "pp")
                        : "Not Available"}
                    </span>
                  </p>
                  <p>
                    Check Out:{" "}
                    <span className="text-amber-300">
                      {!!ticket?.visitor?.checkOutDate
                        ? format(ticket.visitor?.checkOutDate, "pp")
                        : "Not Available"}
                    </span>
                  </p>
                </div>
              </section>
            ) : (
              <div className="mt-4 text-center text-xl font-bold">
                <p>Today is not the Event Date</p>
                {ticket.event?.date && (
                  <CountdownTimer date={ticket.event?.date} />
                )}
                <p className="text-base text-rose-400">
                  TODOS: Setup Start & End Event Time
                </p>
              </div>
            )}
          </div>

          <Button
            variant="secondary"
            size="lg"
            className="mt-8"
            onClick={() => void router.back()}
          >
            Go Back
          </Button>
        </Wrapper>
      </CardContent>
    </Card>
  )
}
