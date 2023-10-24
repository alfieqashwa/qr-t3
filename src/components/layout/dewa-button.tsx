import Link from "next/link"
import { useRouter } from "next/router"
import { Button } from "~/ui/button"
import { DewaOnly } from "../authed/dewa-only"

export function DewaButton() {
  const { asPath, query } = useRouter()
  const slug = query?.slug as string

  const disabled = asPath === `/${slug}/dewa`
  return (
    <DewaOnly>
      <Link href={`/${slug}/dewa`} className="fixed bottom-0.5 right-1 z-40">
        <Button
          className="opacity-30 transition-opacity duration-1000 ease-in-out hover:opacity-100 disabled:pointer-events-auto disabled:cursor-not-allowed"
          size="sm"
          variant="destructive"
          disabled={disabled}
        >
          Go to Dewa
        </Button>
      </Link>
    </DewaOnly>
  )
}
