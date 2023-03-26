import type { ReactNode } from "react"
import { Header } from "./Header"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { Menu, Settings } from "lucide-react"

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
      <main className="bg-zinc-800 text-zinc-200 grid grid-cols-12">
        <aside className="bg-zinc-700 min-h-screen col-span-2">
          <ul>
            <li>Content</li>
            <li>Content</li>
            <li>Content</li>
            <li>Content</li>
            <li>Content</li>
            <li>Content</li>
          </ul>
        </aside>
        <div className="col-span-10">
          <nav className="py-8 flex items-center">
            <div className="flex space-x-8 items-center">
              <Menu className="kurt" />
              <h1 className="font-semibold text-xl">Event</h1>
            </div>
            <input type="text" className="py-2 rounded-lg bg-zinc-900" />
            <Settings />
          </nav>
          <section className="thom bg-zinc-800/80 py-3">
            <h4>Event / International </h4>
          </section>
          {children}
        </div>
      </main>
    </>
  )
}
