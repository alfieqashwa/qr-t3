import { format } from "date-fns"
import { id } from "date-fns/locale"
import { type NextPage } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import { HeadMetaData } from "~/components/head-metadata"
import { LoadingSpinner } from "~/components/loading"
import { CreateNewTicketOrder } from "~/src/components/official"
import { DEFAULT_EVENT_THUMBNAIL } from "~/src/constants/default"
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
    }
  )

  if (status !== "success") return <LoadingSpinner />
  return (
    <>
      <HeadMetaData
        title={slug.toUpperCase()}
        metaDescription={`QR-Code Event Organizer - ${slug.toUpperCase()} Application`}
        pathname={`/${slug}`}
      />
      <div className="thom min-h-screen bg-slate-950 p-4 sm:p-2 lg:p-12">
        <header className="space-y-3 text-center font-bold">
          <h1 className="text-4xl uppercase text-amber-300">{slug}</h1>
          <h2 className="text-4xl capitalize">{event.all?.title}</h2>
          <h2 className="text-2xl capitalize">{event.all?.venue}</h2>
          <h2 className="text-2xl capitalize">
            {format(event.all?.date as Date, "PPPP", { locale: id })}
          </h2>
        </header>
        <main>
          <ul className="mt-4 flex justify-center space-x-8">
            {event.filteredTickets?.map((t) => (
              <li className="text-2xl font-bold capitalize" key={t.category}>
                <span>{t.category} :</span>{" "}
                <span className="text-amber-300">
                  {/* remove decimal numbers using regex instead of set 'minimumFractionDigits' within fn formattedPrice */}
                  {formattedPrice.format(t.price).replace(/,\d+$/, "")}
                </span>
              </li>
            ))}
          </ul>
          <CreateNewTicketOrder
            eventOrganizerId={event.all?.eventOrganizerId as string}
            eventId={event.all?.id as string}
          />
          <div className="relative mt-12 flex justify-center">
            {status === "success" && (
              <Image
                src={event.all?.thumbnail ?? DEFAULT_EVENT_THUMBNAIL}
                alt={event.all?.title as string}
                width={500}
                height={500}
                className={cn(
                  "aspect-[3/4] h-auto w-auto object-cover transition-all hover:scale-105"
                  //   aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
                )}
              />
            )}
          </div>
        </main>
      </div>
    </>
  )
}

export default EventIdPage
