import { type NextPage } from "next"
import Link from "next/link"
import { useSession } from "next-auth/react"

import { api } from "@/utils/api"
import { H1Title } from "@/components/H1.Title"
import { Layout } from "@/components/Layout"

const Dashboard: NextPage = () => {
  const { data: sessionData } = useSession()

  const { data: users } = api.example.getAllUsers.useQuery()

  const userEmail = sessionData?.user.email as string
  const { data: user } = api.example.getUserByEmail.useQuery(userEmail)

  const isDewa = user?.role === "DEWA"

  console.log(sessionData)
  return (
    <Layout>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <H1Title />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/"
          >
            <h3 className="text-2xl font-bold">Home →</h3>
            <div className="text-lg">Just the basics - Go Home</div>
          </Link>
        </div>
        <div className="text-slate-200">
          {isDewa ? (
            <pre>{JSON.stringify(users, null, 2)}</pre>
          ) : (
            <pre>{JSON.stringify(user, null, 2)}</pre>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
