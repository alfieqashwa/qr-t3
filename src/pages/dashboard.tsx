import type { GetServerSideProps } from "next"
import { type NextPage } from "next"

import { getServerSession } from "next-auth/next"
import { authOptions } from "~/server/auth"
import { Layout } from "~/components/layout"
import { LoadingSpinner } from "~/components/loading"
import { api } from "~/utils/api"

const title = "Dashboard" as const
const DashboardPage: NextPage = () => {
  const { data, status } = api.dashboard.getAll.useQuery()

  const totalPrice = (category: string) =>
    data?.map((d) =>
      d.tickets
        .filter((t) => t.category === category)
        .reduce((total, ticket) => total + ticket.price, 0)
    )

  console.log(`FESTIVAL::: `, totalPrice("festival"))
  console.log(`TRIBUN::: `, totalPrice("tribun"))

  return (
    <Layout title={title}>
      <div className="mb-8 text-xl font-semibold text-rose-400">
        {/* // TODOS:  Divide Ticket based on category */}
        {/* // TODOS:  Estimate ticket omzet based on category */}
        <p>TODOS: List all Events</p>
        <p>TODOS: Estimate the total of ticket price of all events</p>
        <p>TODOS: Divide Ticket based on category</p>
        <p>
          TODOS: Estimate the total of ticket price based on ticket category
        </p>
      </div>
      <div>
        {status === "loading" && <LoadingSpinner />}
        {status === "success" && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
      <div>
        <p>Ticket: {data?.map((d) => d._count.tickets)}</p>
        <p>Visitor: {data?.map((d) => d._count.visitors)}</p>
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

  // If user has not have EventOrganizerId, then redirect to page "/settings/create-eo"
  if (!session.user.eventOrganizerId) {
    return {
      redirect: {
        destination: "/settings/create-eo",
        permanent: false,
      },
    }
  }

  // If user has EventOrganizerId but as an OPERATOR, then cannot enter this page.
  if (session.user.eventOrganizerId && session.user.role === "OPERATOR") {
    return {
      redirect: {
        destination: "/scanner",
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
