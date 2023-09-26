import { LogOut } from "lucide-react"
import { type GetServerSideProps, type NextPage } from "next"
import { getServerSession } from "next-auth"
import { signOut } from "next-auth/react"
import QRScanner from "~/components/qrcode/scanner"
import { authOptions } from "~/server/auth"
import { Button } from "~/src/components/ui/button"

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

  return {
    props: {
      session,
    },
  }
}

export default ScannerPage
