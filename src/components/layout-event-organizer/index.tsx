import { Codesandbox } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Button } from "~/ui/button"
import { Copyright } from "../footer"

export const LayoutEventOrganizer = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { query } = useRouter()
  const slug = query.slug as string
  const { status } = useSession()

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="h-14">
        <nav className="flex items-center space-x-6">
          <Link
            href={`/${slug}`}
            className="flex shrink-0 items-center pl-6 pt-4"
          >
            <Codesandbox size={36} className="animate-spin" />
          </Link>
          {status === "authenticated" && (
            <Link href={`/${slug}/dashboard`} className="pt-1">
              <Button size="sm" variant="outline">
                Go to Dashboard
              </Button>
            </Link>
          )}
        </nav>
      </header>
      <main className="px-2 pb-6 pt-4 sm:px-4 lg:px-6">{children}</main>
      <Copyright />
    </div>
  )
}
