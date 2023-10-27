import type { ReactNode } from "react"
import { SlugContextProvider } from "~/src/store/slug-context-provider"
import { cn } from "~/src/utils"
import useToggleStore from "~/store/useToggle"
import { Copyright } from "../footer"
import { DewaButton } from "./dewa-button"
import { Drawer } from "./drawer"
import { Header } from "./header"
import { NavigationHeader } from "./navigation-header"

type LayoutProps = { title: string; children: ReactNode }

export const Layout = ({ title, children }: LayoutProps) => {
  const { toggle } = useToggleStore()

  const titleHeader = `${title} | Event Organizer App`

  return (
    <SlugContextProvider>
      <Header titleHeader={titleHeader} />
      <div>
        <NavigationHeader />
        <Drawer />
        {/* STARTS MAIN */}
        <main
          className={cn(
            "px-2 pb-6 pt-24 transition-all duration-500 ease-in-out sm:px-6",
            toggle ? "lg:ml-60" : "lg:ml-28",
          )}
        >
          {children}
        </main>
        {/* ENDS MAIN */}
      </div>
      <Copyright />
      <DewaButton />
    </SlugContextProvider>
  )
}
