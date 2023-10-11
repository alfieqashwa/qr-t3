import { Codesandbox } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"

export const LayoutEventOrganizer = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { query } = useRouter()
  const slug = query.slug as string

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="h-14">
        <nav>
          <Link
            href={`/${slug}`}
            className="flex shrink-0 items-center pl-6 pt-4"
          >
            <Codesandbox size={36} className="animate-spin" />
          </Link>
        </nav>
      </header>
      <main className="px-2 py-4 sm:px-4 lg:px-6">{children}</main>
    </div>
  )
}
