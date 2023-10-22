iimport type { GetServerSideProps } from "next"
import { type NextPage } from "next"
import { getServerSession } from "next-auth/next"
import { EventList, SeatList, TicketList } from "~/components/events"
import { HeaderTitle } from "~/components/header-title"
import { Layout } from "~/components/layout"
import { LoadingSpinner } from "~/components/loading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { authOptions } from "~/server/auth"
import { prisma } from "~/server/db"
import { api } from "~/utils/api"

const title = "Events" as const
const EventPage: NextPage = () => {
  const countProfitEvents = api.event.count.useQuery({ isProfit: true })
  const countNonProfitEvents = api.event.count.useQuery({ isProfit: false })

  return (
    <Layout title={title}>
      <HeaderTitle title={title} />
      <Tabs
        defaultValue="event-list"
        className="mt-4"
      >
        <TabsList className="mb-3">
          <TabsTrigger value="event-list">Event</TabsTrigger>
          <TabsTrigger
            value="ticket-list"
            disabled={countProfitEvents.data === 0}
          >
            Ticket
          </TabsTrigger>
          <TabsTrigger
            value="seat-list"
            disabled={countNonProfitEvents.data === 0}
          >
            Seat
          </TabsTrigger>
        </TabsList>
        <TabsContent value="event-list">
          <EventList />
        </TabsContent>
        <TabsContent value="ticket-list">
          {countProfitEvents.status === "loading" ? (
            <LoadingSpinner />
          ) : (
            <TicketList />
          )}
        </TabsContent>
        <TabsContent value="seat-list">
          {countNonProfitEvents.status === "loading" ? (
            <LoadingSpinner />
          ) : (
            <SeatList />
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  )
}

export default EventPage

// If No Authenticated, then redirect to Home Page. Else, enter this page.
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  // If user has not have EventOrganizerId, then redirect to page "/create-eo"
  if (session && !session.user.eventOrganizerId) {
    return {
      redirect: {
        destination: "/create-eo",
        permanent: false,
      },
    }
  }

  if (session && session.user.eventOrganizerId) {
    const getEoNameBySessionId = await prisma.eventOrganizer.findUnique({
      where: { id: session.user.eventOrganizerId },
      select: { name: true },
    })

    const slug = getEoNameBySessionId?.name.replace(/\s+/g, "-") as string

    if (slug !== ctx.query.slug) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      }
    }

    if (session.user.role === "OPERATOR")
      return {
        redirect: {
          destination: `/${slug}/scanner`, // If user has EventOrganizerId and user role as an OPERATOR, then enter this page.
          permanent: false,
        },
      }
  }

  return {
    props: {
      session,
    },
  }
}
