import type { GetServerSideProps } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "~/server/auth"
import { prisma } from "~/server/db"

type Props = { slug: string }

const SlugPage = (props: Props) => {
  const { slug } = props

  return (
    <div className="min-h-screen bg-slate-950 p-12">
      <header className="space-y-3 text-center text-4xl font-bold">
        <h1 className="uppercase text-amber-300">{slug}</h1>
        <h2 className="capitalize">Official Website</h2>
      </header>
    </div>
  )
}

export default SlugPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  const slugQuery = await prisma.eventOrganizer.findFirst({
    where: { id: session?.user.eventOrganizerId as string },
    select: { name: true },
  })

  const slug = slugQuery?.name as string

  const allowedPath = "/create-eo"

  if (
    ctx.query.slug !== allowedPath &&
    ctx.query.slug !== slug.replace(/\s+/g, "-")
  )
    return {
      redirect: {
        destination: "/404",
        permanent: false, // Set to true for a permanent redirect (HTTP 301), false for temporary (HTTP 302)
      },
    }

  return {
    props: {
      slug,
    },
  }
}
