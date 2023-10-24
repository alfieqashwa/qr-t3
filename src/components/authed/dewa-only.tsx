import { Role } from "@prisma/client"
import { useSession } from "next-auth/react"
import type { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export function DewaOnly({ children }: Props): JSX.Element {
  const { data: session, status } = useSession({
    required: true,
  })

  return <>{status && session?.user.role === Role.DEWA && children}</>
}
