import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { api } from "~/src/utils/api"

export const AuthShowcase = (): JSX.Element => {
  const session = useSession()

  const { data, status } = api.eo.nameBySessionId.useQuery(undefined, {
    select: (data) => ({ slug: data?.name.replace(/\s+/g, "-") }),
  })

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {session.data && (
          <span className="text-sm lg:text-base">
            Logged in as {session.data.user?.name}
          </span>
        )}
      </p>
      <section className="space-x-4 lg:space-x-8">
        <button
          className="rounded-full bg-slate-700 px-8 py-3 text-sm font-semibold text-white no-underline transition hover:bg-white/20 lg:px-10 lg:text-base"
          onClick={session.data ? () => void signOut() : () => signIn("google")}
        >
          {session.data ? "Sign out" : "Sign in"}
        </button>
        {session.data && status === "success" && (
          <Link
            className="rounded-full bg-white/10 px-8 py-3 text-sm font-semibold text-white no-underline transition duration-300 ease-in-out hover:bg-white/20 active:bg-white/25 lg:px-10 lg:text-base"
            href={`/${data.slug as string}/dashboard`}
          >
            Dashboard
          </Link>
        )}
      </section>
    </div>
  )
}
