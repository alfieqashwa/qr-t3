import type { GetServerSideProps } from "next"
import { type NextPage } from "next"
import { getServerSession } from "next-auth/next"
import { EventList, TicketList } from "~/components/events"
import { HeaderTitle } from "~/components/header-title"
import { Layout } from "~/components/layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { authOptions } from "~/server/auth"
import { LoadingSpinner } from "~/src/components/loading"
import { prisma } from "~/src/server/db"
import { api } from "~/utils/api"

const title = "Events" as const
const EventPage: NextPage = (): JSX.Element => {
  const { data: count, isLoading } = api.event.count.useQuery()

  return (
    <Layout title={title}>
      <HeaderTitle title={title} />
      <Tabs defaultValue="event-list" className="mt-4">
        <TabsList className="mb-3">
          <TabsTrigger className="text-xs lg:text-sm" value="event-list">
            Event
          </TabsTrigger>
          <TabsTrigger
            className="text-xs lg:text-sm"
            value="ticket-list"
            disabled={count === 0}
          >
            Ticket
          </TabsTrigger>
        </TabsList>
        {isLoading && <LoadingSpinner />}
        <TabsContent value="event-list">
          <EventList />
        </TabsContent>
        <TabsContent value="ticket-list">
          <TicketList />
        </TabsContent>
      </Tabs>
    </Layout>
  )
}

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

  const getEoNameBySessionId = await prisma.eventOrganizer.findUnique({
    where: { id: session.user.eventOrganizerId as string },
    select: { name: true },
  })

  const slug = getEoNameBySessionId?.name.replace(/\s+/g, "-") as string

  // If user has not have EventOrganizerId, then redirect to page "/create-eo"
  if (!session.user.eventOrganizerId) {
    return {
      redirect: {
        destination: "/create-eo",
        permanent: false,
      },
    }
  }

  if (session.user.eventOrganizerId && slug !== ctx.query.slug) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    }
  }

  // If user has EventOrganizerId but as an OPERATOR, then cannot enter this page.
  if (
    session.user.eventOrganizerId &&
    !!slug &&
    session.user.role === "OPERATOR"
  ) {
    return {
      redirect: {
        destination: `/${slug}/scanner`,
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

export default EventPage
