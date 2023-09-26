import type { GetServerSideProps, NextPage } from "next"
import { getServerSession } from "next-auth/next"
import { CardEvent } from "~/components/dashboard"
import { Layout } from "~/components/layout"
import { LoadingSpinner } from "~/components/loading"
import { authOptions } from "~/server/auth"
import { prisma } from "~/src/server/db"
import { api } from "~/utils/api"

const title = "Dashboard" as const
const DashboardPage: NextPage = () => {
  const { data, status } = api.dashboard.getAll.useQuery()
  return (
    <Layout title={title}>
      {status === "loading" && <LoadingSpinner />}
      <div className="mt-4 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
        {status === "success" &&
          data.map((event) => {
            const { id, title, venue, date, tickets, visitors } = event
            return (
              <CardEvent
                title={title}
                venue={venue}
                date={date}
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

  const slugQuery = await prisma.eventOrganizer.findFirst({
    where: { id: session?.user.eventOrganizerId as string },
    select: { name: true },
  })

  const querySlug = ctx.query.slug as string
  const slug = slugQuery?.name?.replace(/\s+/g, "-") as string

  if (querySlug !== slug) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    }
  }

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  // If user has not have EventOrganizerId, then redirect to page "/create-eo"
  if (!session.user.eventOrganizerId) {
    return {
      redirect: {
        destination: "/create-eo",
        permanent: false,
      },
    }
  }

  // If user has EventOrganizerId but as an OPERATOR, then cannot enter this page.
  if (session.user.eventOrganizerId && session.user.role === "OPERATOR") {
    return {
      redirect: {
        destination: `${slug}/scanner`,
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
