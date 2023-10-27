import Head from "next/head"
import { AuthShowcase } from "~/components/authed"
import { HeadMetaData } from "~/components/head-metadata"
import { Copyright } from "~/components/footer"

export default function IndexPage() {
  return (
    <>
      <HeadMetaData metaDescription="QR-Code Event Organizer - Alfie Qashwa Application" />
      <Head>
        <title>Event Organization App</title>
        <meta name="description" content="QR Ticket" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16">
          <h2 className="text-lg font-semibold tracking-wider text-amber-300">
            Welcome
          </h2>
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
      <Copyright />
    </>
  )
}
