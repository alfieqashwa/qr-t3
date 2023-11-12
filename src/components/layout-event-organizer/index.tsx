import { Codesandbox } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Copyright } from "~/components/footer"
import { Button } from "~/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/ui/tooltip"
import { api } from "~/utils/api"

export const LayoutEventOrganizer = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [{ query }, session] = [useRouter(), useSession()]
  const slug = query.slug as string

  const nameBySessionId = api.eo.nameBySessionId.useQuery(
    {
      id: session.data?.user.eventOrganizerId as string,
    },
    {
      enabled: !!session.data?.user.eventOrganizerId,
      select: (data) => ({
        slug: data?.name.replace(/\s+/g, "-"),
      }),
    },
  )

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="h-14">
        <nav className="flex items-center justify-between pl-6 pr-4 pt-3.5  lg:pr-8">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link href={`/${slug}`} className="">
                  <Codesandbox size={36} className="animate-spin" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Home</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {session.status === "authenticated" &&
            nameBySessionId.status === "success" && (
              <Link href={`/${nameBySessionId.data.slug}/dashboard`}>
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
