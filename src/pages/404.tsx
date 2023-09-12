import { useRouter } from "next/router"
import { Button } from "../components/ui/button"

export default function Page404() {
  const router = useRouter()
  return (
    <div className="grid min-h-screen place-items-center">
      <h1 className="text-center text-2xl font-bold md:text-4xl">
        404 - Page Not Found
      </h1>
      <Button
        size="lg"
        className="font-bold capitalize"
        onClick={() => void router.back()}
      >
        Go back
      </Button>
    </div>
  )
}
