import { Role } from "@prisma/client"
import { useSession } from "next-auth/react"
import type { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export function AdminOnly({ children }: Props): JSX.Element | null {
  const session = useSession()

  if (session.status !== "authenticated") return null
  if (
    session.data.user.role === Role.DEWA ||
    session.data.user.role === Role.ADMIN
  ) {
    return <>{children}</>
  }
  return null
}
