import { createContext, type ReactNode } from "react"
import { api } from "~/utils/api"

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
  const { data } = api.eo.nameBySessionId.useQuery(undefined, {
    select: (data) => ({
      slug: data?.name.replace(/\s+/g, "-"),
    }),
  })

  return (
    <SlugContext.Provider value={{ slug: data?.slug }}>
      {children}
    </SlugContext.Provider>
  )
}
