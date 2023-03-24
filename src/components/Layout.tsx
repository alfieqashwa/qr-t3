import type { ReactNode } from "react"
import { Header } from "./Header"
import { DrawerUI } from "@/ui/drawer"

type LayoutProps = { title?: string; children: ReactNode }

export const Layout = ({ title = "", children }: LayoutProps): JSX.Element => {
  const titleHeader = `QR Ticket Concert | ${title}`

  return (
    <>
      <Header titleHeader={titleHeader} />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <DrawerUI />
        {children}
      </main>
    </>
  )
}
