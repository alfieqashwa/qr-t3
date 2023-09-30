import { Role } from "@prisma/client"
import type { GetServerSideProps } from "next"
import { type NextPage } from "next"
import { getServerSession } from "next-auth/next"
import { HeaderTitle } from "~/components/header-title"
import { Layout } from "~/components/layout"
import { LoadingSpinner } from "~/components/loading"
import { authOptions } from "~/server/auth"
import { prisma } from "~/server/db"
import { api } from "~/utils/api"

const title = "Dewa"
const DewaPage: NextPage = () => {
  const { data, status } = api.dewa.getAll.useQuery()
  console.table(data)
  console.log({ data })

  return (
    <Layout title={title}>
      <HeaderTitle title={title} />
      <div className="mt-4 h-[calc(100vh_-_17vh)]">
        <h3>{title} is here...</h3>
        <div className="mt-8">
          {status === "loading" && <LoadingSpinner />}
          {status === "error" && <p>An Error occured</p>}
          {status === "success" && <pre>{JSON.stringify(data, null, 4)}</pre>}
        </div>
      </div>
    </Layout>
  )
}

export default DewaPage

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
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    const slug = getEoNameBySessionId?.name.replace(/\s+/g, "-") as string
    const isDewa = user?.role === Role.DEWA

    if (slug !== ctx.query.slug || !isDewa) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      }
    }
  }

  return {
    props: {
      session,
    },
  }
}
