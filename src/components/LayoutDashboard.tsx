import { Bell, Codesandbox, Menu, Settings, User } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import type { ReactNode } from "react"
import { Header } from "./Header"

type LayoutProps = { title?: string; children: ReactNode }

export const LayoutDashboard = ({ title = "Default", children }: LayoutProps): JSX.Element => {
  const titleHeader = `QR Ticket Concert | ${title}`

  const { data: sessionData } = useSession()
  // const router = useRouter()

  // console.log(`ROUTER::: `, JSON.stringify(router, null, 2))

  // const userEmail = sessionData?.user.email
  const userImage = sessionData?.user?.image
  // console.log(userEmail)

  console.log(sessionData?.user.image)
  return (
    <>
      <Header titleHeader={titleHeader} />
      <div className="bg-gradient-to-b from-black to-slate-900 text-zinc-50 relative container max-w-full">
        <NavigationHeader image={userImage as string} />
        <Drawer />
        <main className="ml-[256px] min-h-screen py-4 mx-auto max-w-full">
          {children}
        </main>
      </div>
    </>
  )
}

type NavigationProps = {
  image?: string
}

const NavigationHeader = (props: NavigationProps) => (
  <nav className="h-16 fixed z-50 w-full flex">
    <section className="flex items-center pr-6 justify-end space-x-8 min-w-[256px] h-16">
      <div className="flex items-center justify-around w-full">
        <Codesandbox size={36} />
        <h2 className="font-bold text-lg">LOGO</h2>
      </div>
      <Menu size={32} />
    </section>
    <section className="space-x-8 flex items-center w-full justify-end px-8">
      <Bell />
      {props.image ?
        <Image src={props.image} alt="profile" width={32} height={32} className="ring-2 ring-offset rounded-full ring-purple-500" /> : <User />
      }
    </section>
  </nav>
)

const Drawer = () => (
  <aside className="bg-gradient-to-b from-zinc-900 to-slate-900 min-h-screen w-[256px] fixed z-30">
    <ul className="mt-20">
      <li className="flex px-4 py-3 mx-2 items-center rounded-xl space-x-6 transition duration-150 ease-in-out hover:bg-zinc-800"><Settings /><h3 className="font-semibold tracking-wider">Home</h3></li>
      <li className="flex px-4 py-3 mx-2 items-center rounded-xl space-x-6 transition duration-150 ease-in-out hover:bg-zinc-800"><Settings /><h3 className="font-semibold tracking-wider">Events</h3></li>
      <li className="flex px-4 py-3 mx-2 items-center rounded-xl space-x-6 transition duration-150 ease-in-out hover:bg-zinc-800"><Settings /><h3 className="font-semibold tracking-wider">Visitors</h3></li>
      <li className="flex px-4 py-3 mx-2 items-center rounded-xl space-x-6 transition duration-150 ease-in-out hover:bg-zinc-800"><Settings /><h3 className="font-semibold tracking-wider">Setting</h3></li>
    </ul>
  </aside>
)