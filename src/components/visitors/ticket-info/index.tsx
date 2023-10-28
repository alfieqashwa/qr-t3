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
import { formattedPrice } from "~/src/utils/formattedPrice"
import { Button } from "~/ui/button"
import { ToastAction } from "~/ui/toast"
import { toast } from "~/ui/use-toast"
import { Wrapper } from "./ticket-wrapper"

type TicketInfoProps = {
  ticket: RouterOutputs["ticket"]["getAllByIdOperatorRole"]
  ticketId: string
}
export const TicketInfo = ({ ticket, ticketId }: TicketInfoProps) => {
  const router = useRouter()
  const utils = api.useUtils()
  const { mutate, isLoading } = api.visitor.toggleCheckOperatorRole.useMutation(
    {
      async onSuccess() {
        toast({
          title: "Succeed!",
          variant: "default",
          description: "Check has been updated.",
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
    },
  )

  const handleCheckIn = (visitorId: string) =>
    mutate({ id: visitorId, isCheckIn: true, checkInDate: new Date() })

  const handleCheckOut = (visitorId: string) =>
    mutate({ id: visitorId, isCheckIn: false, checkOutDate: new Date() })

  const isTodaysEventYet =
    ticket?.event?.date &&
    ticket.event.date.toDateString() === new Date().toDateString()
  console.log(`isTodayEventYet::: `, isTodaysEventYet)
  return (
    <Card className="min-h-screen min-w-fit px-2 py-8 sm:px-6 lg:px-12">
      <CardHeader className="text-center">
        <CardTitle className="md:text-xl">Ticket Information</CardTitle>
        <CardDescription className="md:text-lg">
          Ticket ID: {ticket?.id}
        </CardDescription>
      </CardHeader>

      <CardContent className="rounded-xl border-2 py-6 shadow-xl">
        <Wrapper title="Event">
          <p className="uppercase text-amber-300">{ticket?.event?.title}</p>
          <p>
            {ticket?.event?.date &&
              format(ticket.event.date, "PPPP", { locale: id })}
          </p>
          <p>
            <span>Venue: </span>
            <span className="capitalize">{ticket?.event?.venue}</span>
          </p>
          <p>
            <span className="uppercase text-amber-300">
              {ticket?.eventOrganizer?.name}
            </span>
          </p>
        </Wrapper>

        <Wrapper title="Ticket Info" className="mt-2">
          <p>
            Category:{" "}
            <span className="uppercase text-amber-300">{ticket?.category}</span>
          </p>
          <p>
            Price:{" "}
            <span className="text-amber-300">
              {formattedPrice.format(ticket?.price as number)}
            </span>
          </p>
          <p>
            Status:{" "}
            <span className="font-bold uppercase text-amber-300">
              {ticket?.status === "SOLD" && "Purchased"}
            </span>
          </p>
        </Wrapper>

        <Wrapper title="Visitor" className="mt-2">
          {ticket?.visitors
            .filter((t) => t.ticketId === ticketId)
            .map((v) => (
              <ul key={v.id} className="flex flex-col items-center">
                <li className="capitalize">
                  <span>Name: </span>
                  <span className="text-amber-300">{v.name}</span>
                </li>
                <li>
                  <span>Phone: </span>
                  <span className="text-amber-300">{v.phone}</span>
                </li>
                <li>
                  <span>Email: </span>
                  <span className="text-amber-300">{v.email}</span>
                </li>
                {!isTodaysEventYet ? ( //! TODOS: remove exclamation-mark when production is ready!
                  <div>
                    <div className="mt-4 text-center text-xl font-bold">
                      <p>Today is not the Event Date</p>
                      <div className="m-2 text-xs text-primary">
                        <p>Button Check-In & Check-Out should be disabled</p>
                        <p>
                          But for the testing development purpose, we enabled
                          them.
                        </p>
                      </div>
                      {ticket.event?.date && (
                        <CountdownTimer date={ticket.event?.date} />
                      )}
                      <p className="text-base text-rose-400">
                        TODOS: Setup Start & End Event Time
                      </p>
                    </div>
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

                    <li className="mt-4 text-center">
                      <p>
                        Check In:{" "}
                        <span className="text-amber-300">
                          {!!v.checkInDate
                            ? format(v.checkInDate, "pp")
                            : "Not Available"}
                        </span>
                      </p>
                      <p>
                        Check Out:{" "}
                        <span className="text-amber-300">
                          {!!v.checkOutDate
                            ? format(v.checkOutDate, "pp")
                            : "Not Available"}
                        </span>
                      </p>
                    </li>
                  </div>
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
              </ul>
            ))}

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
