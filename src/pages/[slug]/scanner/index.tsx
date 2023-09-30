import { LogOut } from "lucide-react"
import { type GetServerSideProps, type NextPage } from "next"
import { getServerSession } from "next-auth"
import { signOut } from "next-auth/react"
import QRScanner from "~/components/qrcode/scanner"
import { authOptions } from "~/server/auth"
import { prisma } from "~/server/db"
import { Button } from "~/ui/button"

const ScannerPage: NextPage = (): JSX.Element => {
  return (
    <div className="min-h-screen w-full py-6">
      <QRScanner />
      <div className="mt-8 w-full text-center">
        <Button size="sm" variant="secondary" onClick={() => signOut()}>
          <span className="px-2">Sign Out</span>
          <LogOut size={18} className="shrink-0" />
        </Button>
      </div>
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

  // If user has not have EventOrganizerId, then redirect to page "/create-eo"
  if (!session.user.eventOrganizerId) {
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

    if (session.user.role !== "OPERATOR")
      return {
        redirect: {
          destination: `/${slug}/dashboard`, // If user has EventOrganizerId and user role as NOT an OPERATOR, then enter this page.
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

export default ScannerPage
