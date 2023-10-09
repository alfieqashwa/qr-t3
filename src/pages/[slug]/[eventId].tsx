import { format } from "date-fns"
import { id } from "date-fns/locale"
import { type NextPage } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import { HeadMetaData } from "~/components/head-metadata"
import { LoadingSpinner } from "~/components/loading"
import { CreateNewPublicVisitor } from "~/components/visitors/visitor-list/create-new-public-visitor"
import { cn } from "~/src/utils"
import { api } from "~/src/utils/api"

const EventIdPage: NextPage = () => {
  const { query } = useRouter()
  const slug = query?.slug as string
  const eventId = query?.eventId as string

  const { data: event, status } = api.event.getByIdPublic.useQuery(
    { id: eventId },
    { enabled: !!eventId }
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
        <header className="space-y-3 text-center text-4xl font-bold">
          <h1 className="uppercase text-amber-300">{slug}</h1>
          <h2 className="capitalize">{event?.title}</h2>
          <h2 className="capitalize">{event?.venue}</h2>
          <h2 className="capitalize">
            {format(event?.date as Date, "PPPP", { locale: id })}
          </h2>
          <pre>{JSON.stringify(event, null, 2)}</pre>
        </header>
        <main>
          <CreateNewPublicVisitor
            eventOrganizerId={event?.eventOrganizerId as string}
            eventId={event?.id as string}
          />
          <div className="relative mt-12 flex justify-center">
            {status === "success" && (
              <Image
                src={
                  event?.thumbnail ??
                  "https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80"
                }
                alt={event?.title as string}
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
