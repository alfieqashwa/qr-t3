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
import { api } from "~/utils/api"
import { formattedPrice } from "~/utils/formattedPrice"

const EventIdPage: NextPage = () => {
  const { query } = useRouter()
  const slug = query?.slug as string
  const eventId = query?.eventId as string

  const { data: event, status } = api.event.getByIdPublic.useQuery(
    { id: eventId },
    { enabled: !!eventId },
  )

  return (
    <>
      <HeadMetaData
        title={slug.toUpperCase()}
        metaDescription={`QR-Code Event Organizer - ${slug.toUpperCase()} Application`}
        pathname={`/${slug}`}
      />
      <LayoutEventOrganizer>
        {status === "loading" && <LoadingSpinner />}
        {status === "success" && !!event && (
          <div className="flex w-full flex-col items-center lg:flex-row-reverse">
            <section className="w-full text-center font-bold lg:w-1/2">
              <h1 className="text-xl uppercase text-amber-300 lg:text-3xl">
                {event.eventOrganizer.name}
              </h1>
              <h2 className="mt-4 text-3xl capitalize lg:text-5xl">
                {event.title}
              </h2>
              <p className="mt-2 text-lg capitalize lg:text-2xl">
                {event.venue}
              </p>
              <div className="mt-2 space-y-1">
                <p className="text-lg capitalize lg:text-2xl">
                  {format(event.date, "PPPP", { locale: id })}
                </p>
                <p className="text-lg capitalize lg:text-2xl">
                  <span className="ml-auto">Time:</span>
                  <span className="ml-1 text-amber-300">
                    {format(event.date, "p")}
                  </span>
                </p>
              </div>
              <ul className="mt-2">
                {event.categories.map((t) => (
                  <li
                    className="text-lg font-bold capitalize lg:text-xl"
                    key={t.name}
                  >
                    <span className="ml-auto">{t.name}:</span>
                    <span className="ml-2 text-amber-300">
                      {/* remove decimal numbers using regex instead of set 'minimumFractionDigits' within fn formattedPrice */}
                      {formattedPrice.format(t.price).replace(/,\d+$/, "")}
                    </span>
                  </li>
                ))}
              </ul>
              <CountdownTimer date={event.date} className="mt-4 text-2xl" />
              <CreateNewTicketOrder eventId={event.id} className="mt-2" />
            </section>

            <section className="relative mt-8 flex w-full justify-center lg:w-1/2">
              {status === "success" && (
                <Image
                  src={event.thumbnail ?? DEFAULT_EVENT_THUMBNAIL}
                  alt={event.title}
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
        )}
      </LayoutEventOrganizer>
    </>
  )
}

export default EventIdPage
