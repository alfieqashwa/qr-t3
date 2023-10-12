import type { GetServerSideProps } from "next"
import { type NextPage } from "next"
import { getServerSession } from "next-auth/next"
import { AdminOnly } from "~/components/authed"
import { HeaderTitle } from "~/components/header-title"
import { Layout } from "~/components/layout"
import { EOInfo, ProfileInfo, TeamList } from "~/components/settings"
import { authOptions } from "~/server/auth"
import { prisma } from "~/server/db"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/ui/tabs"

const title = "Settings" as const

const SettingsPage: NextPage = () => {
  return (
    <Layout title={title}>
      <HeaderTitle title={title} />
      <Tabs defaultValue="profile" className="mt-4">
        <TabsList className="mb-3">
          <TabsTrigger className="text-xs lg:text-sm" value="profile">
            Profile
          </TabsTrigger>
          <TabsTrigger className="text-xs lg:text-sm" value="event-organizer">
            Event Organizer
          </TabsTrigger>
          <AdminOnly>
            <TabsTrigger className="text-xs lg:text-sm" value="team-info">
              Team Info
            </TabsTrigger>
          </AdminOnly>
        </TabsList>
        <TabsContent value="profile">
          <ProfileInfo />
        </TabsContent>
        <TabsContent value="event-organizer">
          <EOInfo />
        </TabsContent>
        <TabsContent value="team-info">
          <TeamList />
        </TabsContent>
      </Tabs>
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
