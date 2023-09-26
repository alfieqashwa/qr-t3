import type { GetServerSideProps, NextPage } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "~/src/server/auth"

const SlugPage: NextPage = () => {
  return null
}

export default SlugPage

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

  return {
    redirect: {
      destination: "/404",
      permanent: false, // Set to true for a permanent redirect (HTTP 301), false for temporary (HTTP 302)
    },
  }
}
