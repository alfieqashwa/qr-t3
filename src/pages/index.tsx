import Head from "next/head"
import { AuthShowcase } from "~/components/authed"
import { HeadMetaData } from "~/components/head-metadata"
import { Copyright } from "~/components/footer"

const HomePage = () => {
  return (
    <>
      <HeadMetaData metaDescription="QR-Code Event Organizer - Alfie Qashwa Application" />
      <Head>
        <title>QR Ticket Concert</title>
        <meta name="description" content="QR Ticket" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-backgorund flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 lg:gap-12 ">
          <h2 className="text-md font-semibold text-amber-300">Home</h2>
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
      <Copyright />
    </>
  )
}

export default HomePage
