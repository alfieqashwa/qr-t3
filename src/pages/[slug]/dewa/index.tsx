import { Role } from "@prisma/client"
import type { GetServerSideProps } from "next"
import { type NextPage } from "next"
import { getServerSession } from "next-auth/next"
import { InputCardList } from "~/components/dewa/input-card-list"
import { Userlist } from "~/components/dewa/user-list"
import { HeaderTitle } from "~/components/header-title"
import { Layout } from "~/components/layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { authOptions } from "~/server/auth"
import { prisma } from "~/server/db"

const title = "Dewa"
const DewaPage: NextPage = () => {
  return (
    <Layout title={title}>
      <HeaderTitle title={title} />

      <Tabs defaultValue="user-info" className="mt-4">
        <TabsList className="mb-3">
          <TabsTrigger className="text-xs lg:text-sm" value="user-info">
            User Info
          </TabsTrigger>
          <TabsTrigger className="text-xs lg:text-sm" value="input-card">
            Input Card
          </TabsTrigger>
        </TabsList>
        <TabsContent value="user-info">
          <Userlist />
        </TabsContent>
        <TabsContent value="input-card">
          <InputCardList />
        </TabsContent>
      </Tabs>
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
