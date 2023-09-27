import type { ReactNode } from "react"
import { SlugContextProvider } from "~/src/store/slug-context-provider"
import { cn } from "~/src/utils"
import useToggleStore from "~/store/useToggle"
import { Drawer } from "./drawer"
import { Header } from "./header"
import { NavigationHeader } from "./navigation-header"

type LayoutProps = { title: string; children: ReactNode }

export const Layout = ({ title, children }: LayoutProps) => {
  const { toggle } = useToggleStore()

  const titleHeader = `${title} | QR Ticket Concert`

  return (
    <SlugContextProvider>
      <Header titleHeader={titleHeader} />
      <div>
        <NavigationHeader />
        <Drawer />
        {/* STARTS MAIN */}
        <main
          className={cn(
            "px-4 pt-24 transition-all duration-500 ease-in-out lg:ml-[256px] lg:px-8",
            toggle ? "" : "lg:-translate-x-[128px]"
          )}
        >
          {children}
        </main>
        {/* ENDS MAIN */}
      </div>
    </SlugContextProvider>
  )
}
