import { Role } from "@prisma/client"
import type { GetServerSideProps } from "next"
import { type NextPage } from "next"
import { getServerSession } from "next-auth/next"
import { HeaderTitle } from "~/components/header-title"
import { Layout } from "~/components/layout"
import { LoadingSpinner } from "~/components/loading"
import { authOptions } from "~/server/auth"
import { prisma } from "~/server/db"
import { Button } from "~/ui/button"
import { Input } from "~/ui/input"
import { Label } from "~/ui/label"
import { ToastAction } from "~/ui/toast"
import { toast } from "~/ui/use-toast"
import { api } from "~/utils/api"

const title = "Dewa"
const DewaPage: NextPage = () => {
  const utils = api.useContext()
  const { data, status } = api.dewa.getAll.useQuery()
  console.table(data)
  console.log({ data })

  const deleteUser = api.user.delete.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "The user has been deleted.",
      })
      await utils.dewa.getAll.invalidate()
      /* auto-closed after succeed submit the dialog form */
    },
    onError() {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    },
  })

  const handleUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const userId = formData.get("userId") as string

    deleteUser.mutate({
      id: userId,
    })
  }

  const deleteEo = api.eo.delete.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "The EO has been deleted.",
      })
      await utils.dewa.getAll.invalidate()
      /* auto-closed after succeed submit the dialog form */
    },
    onError() {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    },
  })

  const handleEOSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const eoId = formData.get("eoId") as string

    deleteEo.mutate({
      id: eoId,
    })
  }

  return (
    <Layout title={title}>
      <HeaderTitle title={title} />
      <div className="mt-4 h-[calc(100vh_-_17vh)]">
        <h3>{title} is here...</h3>
        <div className="mt-8">
          {status === "loading" && <LoadingSpinner />}
          {status === "error" && <p>An Error occured</p>}
          {status === "success" && <pre>{JSON.stringify(data, null, 4)}</pre>}
        </div>
        <section className="mx-auto mb-20 flex max-w-2xl items-center justify-between border-2 px-8 py-4">
          <form onSubmit={handleUserSubmit}>
            <div className="flex- flex-col space-y-1.5">
              <Label htmlFor="name">USER ID</Label>
              <Input
                id="userId"
                type="text"
                name="userId"
                placeholder="Input User ID"
              />
            </div>
            <div className="mt-8 flex justify-end">
              <Button type="submit" size="sm">
                Delete User
              </Button>
            </div>
          </form>
          <form onSubmit={handleEOSubmit}>
            <div className="flex- flex-col space-y-1.5">
              <Label htmlFor="name">EO ID</Label>
              <Input
                id="eoId"
                type="text"
                name="eoId"
                placeholder="Input EO ID"
              />
            </div>
            <div className="mt-8 flex justify-end">
              <Button type="submit" size="sm">
                Delete EO
              </Button>
            </div>
          </form>
        </section>
      </div>
    </Layout>
  )
}

export default DewaPage

// If No Authenticated, then redirect to Home Page. Else, enter this page.
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  // If user has not have EventOrganizerId, then redirect to page "/create-eo"
  if (session && !session.user.eventOrganizerId) {
    return {
      redirect: {
        destination: "/create-eo",
        permanent: false,
      },
    }
  }

  if (session && session.user.eventOrganizerId) {
    const getEoNameBySessionId = await prisma.eventOrganizer.findUnique({
      where: { id: session.user.eventOrganizerId },
      select: { name: true },
    })
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    const slug = getEoNameBySessionId?.name.replace(/\s+/g, "-") as string
    const isDewa = user?.role === Role.DEWA

    if (slug !== ctx.query.slug || !isDewa) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      }
    }
  }

  return {
    props: {
      session,
    },
  }
}
