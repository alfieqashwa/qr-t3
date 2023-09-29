import { GetServerSideProps, type NextPage } from "next"
import Head from "next/head"
import { AuthShowcase } from "~/components/authed"
import { Button } from "../components/ui/button"
import { api } from "../utils/api"
import { Session, getServerSession } from "next-auth"
import { authOptions } from "../server/auth"
import { prisma } from "../server/db"

const HomePage = () => {
  // const utils = api.useContext()
  // const { data, status } = api.dewa.getAll.useQuery()
  // const { mutate } = api.dewa.deleteAll.useMutation({
  //   async onSuccess() {
  //     await utils.dewa.getAll.invalidate()
  //   },
  // })

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
            {/* {status === "success" && <pre>{JSON.stringify(data, null, 2)}</pre>} */}
            <AuthShowcase />
          </div>
        </div>
      </main>
      {/* <Button onClick={() => mutate()}>Delete All Users</Button> */}
    </>
  )
}

export default HomePage
