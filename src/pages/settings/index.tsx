import type { GetServerSideProps } from "next"
import { type NextPage } from "next"

import { HeaderTitle } from "~/src/components/header-title"
import { Layout } from "~/src/components/layout"

import { getServerSession } from "next-auth/next"
import { authOptions } from "~/server/auth"
import { AdminOnly } from "~/src/components/authed"
import { EOInfo, ProfileInfo, TeamList } from "~/src/components/settings"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/src/components/ui/tabs"

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
