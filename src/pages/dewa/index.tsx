import type { GetServerSideProps } from "next"
import { type NextPage } from "next"

import { HeaderTitle } from "~/components/header-title"
import { Layout } from "~/components/layout"

import { Role } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import { LoadingSpinner } from "~/components/loading"
import { authOptions } from "~/server/auth"
import { prisma } from "~/server/db"
import { api } from "~/utils/api"

const title = "Dewa"
const SettingsPage: NextPage = () => {
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

export default SettingsPage

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

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  const isDewa = user && user.role === Role.DEWA
  // console.log({ isDewa });

  // sample authorization based on user.role
  if (!isDewa) {
    return {
      redirect: {
        destination: "/",
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
