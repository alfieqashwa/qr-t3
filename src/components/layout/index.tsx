"use client"

import type { ReactNode } from "react"
import { Drawer } from "./drawer"
import { Header } from "./header"
import { NavigationHeader } from "./navigation-header"
import useToggleStore from "~/store/useToggle"
import { cn } from "~/src/utils"
import { api } from "~/src/utils/api"

type LayoutProps = { title: string; children: ReactNode }

export const Layout = ({ title, children }: LayoutProps) => {
  const { toggle } = useToggleStore()

  const titleHeader = `${title} | QR Ticket Concert`

  const { data, status } = api.eo.nameBySessionId.useQuery(undefined, {
    select: (data) => ({
      slug: data?.name.replace(/\s+/g, "-"),
    }),
  })
  return (
    <>
      <Header titleHeader={titleHeader} />
      <div>
        {status === "success" && (
          <NavigationHeader slug={data?.slug as string} />
        )}
        {status === "success" && <Drawer slug={data?.slug as string} />}
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
    </>
  )
}
