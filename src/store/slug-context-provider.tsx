import { useRouter } from "next/router"
import { createContext, type ReactNode } from "react"
import { LoadingSpinner } from "../components/loading"

type SlugContextProvider = {
  slug: string | undefined
}

type Props = {
  children: ReactNode
}

export const SlugContext = createContext<SlugContextProvider>({
  slug: undefined,
})

export const SlugContextProvider = ({ children }: Props) => {
  const { query } = useRouter()
  const slug = query.slug as string

  if (!slug) return <LoadingSpinner />

  return (
    <SlugContext.Provider value={{ slug }}>{children}</SlugContext.Provider>
  )
}
