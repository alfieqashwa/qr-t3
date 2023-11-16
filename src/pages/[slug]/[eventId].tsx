import { format } from "date-fns"
import { id } from "date-fns/locale"
import { type NextPage } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import { CountdownTimer } from "~/components/countdownTimer"
import { HeadMetaData } from "~/components/head-metadata"
import { LayoutEventOrganizer } from "~/components/layout-event-organizer"
import { LoadingSpinner } from "~/components/loading"
import { CreateNewTicketOrder } from "~/components/official"
import { DEFAULT_EVENT_THUMBNAIL } from "~/constants/default"
import { cn } from "~/src/utils"
import { api } from "~/src/utils/api"
import { formattedPrice } from "~/src/utils/formattedPrice"

const EventIdPage: NextPage = () => {
  const { query } = useRouter()
  const slug = query?.slug as string
  const eventId = query?.eventId as string

  const { data: event, status } = api.event.getByIdPublic.useQuery(
    { id: eventId },
    {
      enabled: !!eventId,
      select: (event) => {
        const all = event
        const _uniqueCombos = new Set()
        const filteredTickets = event?.tickets.filter((t) => {
          const _combo = JSON.stringify({
            category: t.category,
            price: t.price,
          })
          if (!_uniqueCombos.has(_combo)) {
            _uniqueCombos.add(_combo)
            return true
          }
          return false
        })

        return {
          all,
          filteredTickets,
        }
      },
    },
  )

  if (status !== "success") return <LoadingSpinner />
  return (
    <>
      <HeadMetaData
        title={slug.toUpperCase()}
        metaDescription={`QR-Code Event Organizer - ${slug.toUpperCase()} Application`}
        pathname={`/${slug}`}
      />
      <LayoutEventOrganizer>
        <div className="flex w-full flex-col items-center lg:flex-row-reverse">
          <section className="w-full text-center font-bold lg:w-1/2">
            <h1 className="text-xl uppercase text-amber-300 lg:text-3xl">
              {event.all?.eventOrganizer.name}
            </h1>
            <h2 className="mt-4 text-3xl capitalize lg:text-5xl">
              {event.all?.title}
            </h2>
            <p className="mt-2 text-lg capitalize lg:text-2xl">
              {event.all?.venue}
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-lg capitalize lg:text-2xl">
                {format(event.all?.date as Date, "PPPP", { locale: id })}
              </p>
              <p className="text-lg capitalize lg:text-2xl">
                <span className="ml-auto">Time:</span>
                <span className="ml-1 text-amber-300">
                  {format(event.all?.date as Date, "p")}
                </span>
              </p>
            </div>
            <ul className="mt-2">
              {event.filteredTickets?.map((t) => (
                <li
                  className="text-lg font-bold capitalize lg:text-xl"
                  key={t.category}
                >
                  <span className="ml-auto">{t.category}:</span>
                  <span className="ml-2 text-amber-300">
                    {/* remove decimal numbers using regex instead of set 'minimumFractionDigits' within fn formattedPrice */}
                    {formattedPrice
                      .format(t.price as number)
                      .replace(/,\d+$/, "")}
                  </span>
                </li>
              ))}
            </ul>
            <CountdownTimer
              date={event.all?.date as Date}
              className="mt-4 text-2xl"
            />
            <CreateNewTicketOrder
              eventId={event.all?.id as string}
              className="mt-2"
            />
          </section>

          <section className="relative mt-8 flex w-full justify-center lg:w-1/2">
            {status === "success" && (
              <Image
                src={event.all?.thumbnail ?? DEFAULT_EVENT_THUMBNAIL}
                alt={event.all?.title as string}
                width={420}
                height={420}
                className={cn(
                  "aspect-square h-auto w-auto object-cover transition-all hover:scale-105 lg:aspect-[3/4]",
                  //   aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
                )}
              />
            )}
          </section>
        </div>
      </LayoutEventOrganizer>
    </>
  )
}

export default EventIdPage
