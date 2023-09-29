import { useSession } from "next-auth/react"
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
  const { data: session } = useSession()
  const { data, status } = api.eo.nameBySessionId.useQuery(
    {
      id: session?.user.eventOrganizerId as string,
    },
    {
      enabled: !!session?.user.eventOrganizerId,
      select: (data) => ({
        slug: data?.name.replace(/\s+/g, "-"),
      }),
    }
  )

  return (
    <>
      {status == "success" && (
        <SlugContext.Provider value={{ slug: data.slug }}>
          {children}
        </SlugContext.Provider>
      )}
    </>
  )
}
