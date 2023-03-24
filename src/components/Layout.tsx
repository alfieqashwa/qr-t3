import type { ReactNode } from "react"
import { Header } from "./Header"

type LayoutProps = { title?: string; children: ReactNode }

export const Layout = ({ title = "", children }: LayoutProps): JSX.Element => {
  const titleHeader = `QR Ticket Concert | ${title}`

  return (
    <>
      <Header titleHeader={titleHeader} />
      <main>{children}</main>
    </>
  )
}
