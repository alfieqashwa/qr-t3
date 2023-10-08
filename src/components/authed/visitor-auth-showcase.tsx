import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { cn } from "~/src/utils"
import { api } from "~/src/utils/api"

export const VisitorAuthShowcase = ({
  eventOrganizerId,
  pathname,
}: {
  eventOrganizerId: string
  pathname: string
}): JSX.Element => {
  const { data: session } = useSession()
  const { data, status } = api.eo.nameBySessionId.useQuery(
    {
      id: eventOrganizerId,
    },
    {
      enabled: !!session?.user.eventOrganizerId,
    }
  )

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <section
        className={cn(
          "space-x-4 lg:space-x-8",
          session && session.user.role !== "USER" && "sr-only"
        )}
      >
        <button
          className="rounded-full bg-slate-700 px-8 py-3 text-sm font-semibold text-white no-underline transition hover:bg-white/20 lg:px-10 lg:text-base"
          onClick={
            session && session.user.role === "USER"
              ? () => void signOut()
              : () => signIn("google", { callbackUrl: `/${pathname}/user` })
          }
        >
          {session && session.user.role === "USER" ? "Sign out" : "Sign in"}
        </button>
      </section>
    </div>
  )
}
