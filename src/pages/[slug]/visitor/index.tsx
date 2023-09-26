import type { GetServerSideProps } from "next"
import { type NextPage } from "next"
import { getServerSession } from "next-auth/next"
import { VisitorList } from "~/components/visitors"
import { HeaderTitle } from "~/components/header-title"
import { Layout } from "~/components/layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { authOptions } from "~/server/auth"
import { prisma } from "~/src/server/db"

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

  const slugQuery = await prisma.eventOrganizer.findUnique({
    where: { id: session?.user.eventOrganizerId as string },
    select: { name: true },
  })

  const querySlug = ctx.query.slug as string
  const slug = slugQuery?.name.replace(/\s+/g, "-") as string

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

export default VisitorPage
