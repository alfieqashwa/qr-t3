import { Calendar, Tag, User, UserCog } from "lucide-react"
import type { GetServerSideProps, NextPage } from "next"
import { getServerSession } from "next-auth/next"
import { CardEvent } from "~/components/dashboard"
import { CardDisplayTotal } from "~/components/dashboard/card-display-total"
import { Layout } from "~/components/layout"
import { LoadingSpinner } from "~/components/loading"
import { authOptions } from "~/server/auth"
import { prisma } from "~/server/db"
import { api } from "~/utils/api"

const title = "Dashboard" as const
const DashboardPage: NextPage = () => {
  const { data: events, status } = api.event.getAllEditorRole.useQuery(
    undefined,
    {
      select: (data) => {
        const all = data.map((d) => d)
        const { totalTickets, totalVisitors } = data.reduce(
          (totals, event) => {
            // Increment totalTickets for each ticket
            totals.totalTickets += event.tickets.length

            // Check if visitor information is available and increment totalVisitors accrodingly
            totals.totalVisitors += event.tickets.reduce(
              (count, ticket) => count + (ticket.visitor ? 1 : 0),
              0,
            )

            return totals
          },
          { totalTickets: 0, totalVisitors: 0 },
        )

        return { all, totalTickets, totalVisitors }
      },
    },
  )
  // TODO: display user list
  const users = api.user.getAllByEOIdAdminRole.useQuery()

  return (
    <Layout title={title}>
      {status === "loading" && <LoadingSpinner />}
      {status === "success" && (
        <div className="flex w-full items-center justify-end space-x-4">
          <CardDisplayTotal
            total={events.all.length}
            tooltipMessage="total events"
            icon={<Calendar />}
          />
          <CardDisplayTotal
            total={events.totalTickets}
            tooltipMessage="total tickets"
            icon={<Tag />}
          />
          <CardDisplayTotal
            total={events.totalVisitors}
            tooltipMessage="total visitors"
            icon={<User />}
          />
          {users.status === "success" && (
            <CardDisplayTotal
              total={users.data?.length}
              tooltipMessage="total team"
              icon={<UserCog />}
            />
          )}
        </div>
      )}
      <div className="mt-4 grid min-w-max grid-cols-1 gap-8 pr-2 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
        {status === "success" &&
          events?.all.map((event) => {
            return <CardEvent event={event} key={event.id} />
          })}
      </div>
    </Layout>
  )
}

export default DashboardPage

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
