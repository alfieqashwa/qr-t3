import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"

export const AuthShowcase = (): JSX.Element => {
  const session = useSession()

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
          className="rounded-full bg-zinc-700 px-8 py-3 text-sm font-semibold text-white no-underline transition hover:bg-white/20 lg:px-10 lg:text-base"
          onClick={
            session.data
              ? () => void signOut()
              : () =>
                  signIn("google", {
                    callbackUrl: "/dashboard",
                  })
          }
        >
          {session.data ? "Sign out" : "Sign in"}
        </button>
        {session.data && (
          <Link
            className="rounded-full bg-white/10 px-8 py-3 text-sm font-semibold text-white no-underline transition duration-300 ease-in-out hover:bg-white/20 active:bg-white/25 lg:px-10 lg:text-base"
            href="/dashboard"
          >
            Dashboard
          </Link>
        )}
      </section>
    </div>
  )
}
