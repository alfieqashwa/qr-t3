import type { GetServerSideProps } from "next"
import Link from "next/link"
import { HeadMetaData } from "~/components/head-metadata"
import { LoadingSpinner } from "~/components/loading"
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area"
import { EventArtwork } from "~/components/website/event-artwork"
import { prisma } from "~/server/db"
import { api } from "~/utils/api"

type Props = { eventOrganizerId: string; slug: string }

const SlugPage = ({ eventOrganizerId, slug }: Props) => {
  const events = api.event.getAllByEventOrganizerIdPublic.useQuery({
    eventOrganizerId: eventOrganizerId,
  })

  const pathname = slug.replace(/\s+/g, "-")

  if (events.status !== "success") return <LoadingSpinner />
  return (
    <>
      <HeadMetaData
        title={slug.toUpperCase()}
        metaDescription={`QR-Code Event Organizer - ${slug.toUpperCase()} Application`}
        pathname={`/${pathname}`}
      />
      <div className="min-h-screen bg-slate-950 p-4 sm:p-2 lg:p-12">
        <header className="space-y-3 text-center text-4xl font-bold">
          <h1 className="uppercase text-amber-300">{slug}</h1>
          <h2 className="capitalize">Official Website</h2>
        </header>
        <main>
          <div className="relative mt-12 flex justify-center">
            <ScrollArea>
              <div className="flex space-x-4 pb-4">
                {events.data.map((event) => (
                  <Link href={`/${pathname}/${event.id}`} key={event.id}>
                    <EventArtwork
                      event={event}
                      className="w-[300px]"
                      aspectRatio="square"
                      width={300}
                      height={300}
                    />
                  </Link>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          {/* <div className="flex flex-col items-center gap-2">
            <VisitorAuthShowcase
              eventOrganizerId={eventOrganizerId}
              pathname={pathname}
            />
          </div> */}
        </main>
      </div>
    </>
  )
}

export default SlugPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const getAllEoName = await prisma.eventOrganizer.findMany({
    select: { id: true, name: true },
  })

  const findEoByQuerySlug = getAllEoName.find(
    (eo) => eo.name.replace(/\s+/g, "-") === (ctx.query.slug as string)
  )

  if (!findEoByQuerySlug?.name)
    return {
      redirect: {
        destination: "/404",
        permanent: false, // Set to true for a permanent redirect (HTTP 301), false for temporary (HTTP 302)
      },
    }

  const { id: eventOrganizerId, name: slug } = findEoByQuerySlug

  return {
    props: {
      eventOrganizerId,
      slug,
    },
  }
}
