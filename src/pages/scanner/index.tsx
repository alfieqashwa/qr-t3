import { type GetServerSideProps, type NextPage } from "next"
import { getServerSession } from "next-auth"
import QRScanner from "~/components/qrcode/scanner"
import { authOptions } from "~/server/auth"

const ScannerPage: NextPage = (): JSX.Element => {
  return (
    <div className="min-h-screen w-full px-3 py-6">
      <QRScanner />
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

export default ScannerPage
