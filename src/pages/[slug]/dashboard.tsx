import type { GetServerSideProps, NextPage } from "next"
import { getServerSession } from "next-auth/next"
import { CardEvent } from "~/components/dashboard"
import { Layout } from "~/components/layout"
import { LoadingSpinner } from "~/components/loading"
import { authOptions } from "~/server/auth"
import { prisma } from "~/server/db"
import { api } from "~/utils/api"

const title = "Dashboard" as const
const DashboardPage: NextPage = () => {
  const { data, status } = api.event.getAllEditorRole.useQuery()
  return (
    <Layout title={title}>
      {status === "loading" && <LoadingSpinner />}
      <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
        {status === "success" &&
          data.map((event) => {
            const { id, title, venue, date, profit, tickets, visitors } = event
            return (
              <CardEvent
                title={title}
                venue={venue}
                date={date}
                profit={profit}
                tickets={tickets}
                visitors={visitors}
                key={id}
              />
            )
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
