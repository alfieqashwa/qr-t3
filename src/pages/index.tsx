import { type NextPage } from "next"
import Head from "next/head"
import { AuthShowcase } from "~/src/components/authed"

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>QR Ticket Concert</title>
        <meta name="description" content="QR Ticket" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950">
        <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 lg:gap-12 ">
          <h2 className="text-md font-semibold text-amber-300">Home</h2>
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  )
}

export default Home
