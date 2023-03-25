import type { ReactNode } from "react"
import { Header } from "./Header"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"

type LayoutProps = { title?: string; children: ReactNode }

export const LayoutDashboard = ({ title = "Default", children }: LayoutProps): JSX.Element => {
  const titleHeader = `QR Ticket Concert | ${title}`

  const { data: sessionData } = useSession()
  const router = useRouter()

  // console.log(`ROUTER::: `, JSON.stringify(router, null, 2))

  const userEmail = sessionData?.user.email
  // console.log(userEmail)


  return (
    <>
      <Header titleHeader={titleHeader} />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {children}
      </main>
    </>
  )
}
