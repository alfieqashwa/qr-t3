import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { api } from "~/src/utils/api"

export const AuthShowcase = (): JSX.Element => {
  const { data: session } = useSession()
  const { data, status } = api.eo.nameBySessionId.useQuery(
    {
      id: session?.user.eventOrganizerId as string,
    },
    {
      enabled: !!session?.user.eventOrganizerId,
      select: (eo) => ({
        slug: eo?.name.replace(/\s+/g, "-"),
      }),
    }
  )

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {session && (
          <span className="text-sm lg:text-base">
            Logged in as {session.user?.name}
          </span>
        )}
      </p>
      <section className="space-x-4 lg:space-x-8">
        <button
          className="rounded-full bg-slate-700 px-8 py-3 text-sm font-semibold text-white no-underline transition hover:bg-white/20 lg:px-10 lg:text-base"
          onClick={
            session
              ? () => void signOut()
              : () => signIn("google", { callbackUrl: "/create-eo" })
          }
        >
          {session ? "Sign out" : "Sign in"}
        </button>
        {session && status === "success" && (
          <Link
            className="rounded-full bg-white/10 px-8 py-3 text-sm font-semibold text-white no-underline transition duration-300 ease-in-out hover:bg-white/20 active:bg-white/25 lg:px-10 lg:text-base"
            href={`/${data?.slug as string}/dashboard`}
          >
            Dashboard
          </Link>
        )}
      </section>
    </div>
  )
}
