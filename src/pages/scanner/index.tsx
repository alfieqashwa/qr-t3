import { type GetServerSideProps, type NextPage } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "~/src/server/auth"

const VisitorByIdPage: NextPage = (): JSX.Element => {
  return (
    <div>
      <h2>SCANNER</h2>
    </div>
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

  // If user has not have EventOrganizerId, then redirect to page "/settings/create-eo"
  if (!session.user.eventOrganizerId) {
    return {
      redirect: {
        destination: "/settings/create-eo",
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
