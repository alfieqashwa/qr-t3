import type { GetServerSideProps } from "next"
import { prisma } from "~/server/db"
import { HeadMetaData } from "~/src/components/head-metadata"

type Props = { slug: string }

const SlugPage = (props: Props) => {
  const { slug } = props
  const pathname = slug.replace(/\s+/g, "-")

  return (
    <>
      <HeadMetaData
        metaDescription={`QR-Code Event Organizer - ${slug.toUpperCase()} Application`}
        pathname={`/${pathname}`}
      />
      <div className="min-h-screen bg-slate-950 p-12">
        <header className="space-y-3 text-center text-4xl font-bold">
          <h1 className="uppercase text-amber-300">{slug}</h1>
          <h2 className="capitalize">Official Website</h2>
        </header>
      </div>
    </>
  )
}

export default SlugPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const getAllEoName = await prisma.eventOrganizer.findMany({
    select: { name: true },
  })

  const filteredSlug = getAllEoName.filter(
    (eo) => eo.name.replace(/\s+/g, "-") === (ctx.query.slug as string)
  )

  if (!filteredSlug[0]?.name)
    return {
      redirect: {
        destination: "/404",
        permanent: false, // Set to true for a permanent redirect (HTTP 301), false for temporary (HTTP 302)
      },
    }

  return {
    props: {
      slug: filteredSlug[0]?.name, // 'cello ltd'
    },
  }
}
