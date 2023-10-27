import { signIn, signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { api } from "~/src/utils/api"
import { Button } from "~/ui/button"

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
    },
  )

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-primary">
        {session && (
          <span className="text-sm lg:text-base">
            Logged in as {session.user?.name}
          </span>
        )}
      </p>
      <section className="space-x-4">
        <Button
          size="lg"
          variant="secondary"
          onClick={
            session
              ? () => void signOut()
              : () => signIn("google", { callbackUrl: "/create-eo" })
          }
        >
          {session ? "Sign out" : "Sign in"}
        </Button>
        {session && status === "success" && (
          <Link
            className="inline-flex h-11 items-center justify-center rounded-md bg-secondary px-8 text-secondary-foreground outline-none hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            href={`/${data?.slug as string}/dashboard`}
          >
            Dashboard
          </Link>
        )}
      </section>
    </div>
  )
}
