import { type GetServerSideProps, type NextPage } from "next"
import { getServerSession } from "next-auth"
import { useRouter } from "next/router"
import { LoadingSpinner } from "~/src/components/loading"
import { TicketInfo } from "~/src/components/visitors/ticket-info"
import { authOptions } from "~/src/server/auth"
import { api } from "~/src/utils/api"

const VisitorByIdPage: NextPage = (): JSX.Element => {
  const { query } = useRouter()
  const ticketId = query.id as string

  const { data: ticket, status: ticketStatus } = api.ticket.getAllById.useQuery(
    { ticketId },
    { enabled: !!ticketId }
  )

  if (ticketStatus !== "success") return <LoadingSpinner />
  return <TicketInfo ticket={ticket} ticketId={ticketId} />
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

  // If user has not have EventOrganizerId, then redirect to page "/create-eo"
  if (!session.user.eventOrganizerId) {
    return {
      redirect: {
        destination: "/create-eo",
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

export default VisitorByIdPage
