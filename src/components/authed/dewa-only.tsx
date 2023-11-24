import { Role } from "@prisma/client"
import type { ReactNode } from "react"
import { api } from "~/utils/api"

type Props = {
  children: ReactNode
}

export function DewaOnly({ children }: Props): JSX.Element | null {
  const { data: me, status } = api.user.me.useQuery()

  if (status === "success" && me?.role === Role.DEWA) return <>{children}</>

  return null
}
