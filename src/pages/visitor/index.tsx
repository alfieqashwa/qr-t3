import type { GetServerSideProps } from "next"
import { type NextPage } from "next"
import { getServerSession } from "next-auth/next"
import { VisitorList } from "~/components/visitors"
import { HeaderTitle } from "~/components/header-title"
import { Layout } from "~/components/layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { authOptions } from "~/server/auth"

const title = "Visitors" as const
const VisitorPage: NextPage = (): JSX.Element => {
  return (
    <Layout title={title}>
      <HeaderTitle title={title} />
      <Tabs defaultValue="visitor-list" className="mt-4">
        <TabsList className="mb-3">
          <TabsTrigger className="text-xs lg:text-sm" value="visitor-list">
            Visitors
          </TabsTrigger>
          <TabsTrigger disabled className="text-xs lg:text-sm" value="preview">
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="visitor-list">
          <VisitorList />
        </TabsContent>
        <TabsContent value="preview">
          <p>empty</p>
        </TabsContent>
      </Tabs>
    </Layout>
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

export default VisitorPage
