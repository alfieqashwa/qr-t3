import { LoadingSpinner } from "~/components/loading"
import { Button } from "~/ui/button"
import { ToastAction } from "~/ui/toast"
import { toast } from "~/ui/use-toast"
import { api } from "~/utils/api"
import { FormCard } from "./form-card"

// TODO: Styling
export const InputCardList = () => {
  const utils = api.useUtils()

  // QUERIES
  const { data, status } = api.eo.getAllDewaRole.useQuery()
  const getAllAccount = api.account.getAllDewaRole.useQuery()

  // MUTATIONS
  const deleteUser = api.user.deleteAdminRole.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "The user has been deleted.",
      })
      await utils.eo.getAllDewaRole.invalidate()
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

  const deleteEo = api.eo.deleteAdminRole.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "The EO has been deleted.",
      })
      await utils.eo.getAllDewaRole.invalidate()
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

  const deleteAccount = api.account.deleteDewaRole.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "The Account has been deleted.",
      })
      await utils.account.getAllDewaRole.invalidate()
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

  const deleteSession = api.session.deleteDewaRole.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "The Session has been deleted.",
      })
      await utils.eo.getAllDewaRole.invalidate()
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

  const deleteAllEventOrganizer = api.eo.deleteAllDewaRole.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "All Event Organizers have been deleted.",
      })
      await utils.eo.getAllDewaRole.invalidate()
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

  // Handle Submit
  const handleUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const id = formData.get("userId") as string
    deleteUser.mutate({
      id,
    })
  }

  const handleEOSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const id = formData.get("eoId") as string
    deleteEo.mutate({
      id,
    })
  }

  const handleAccountSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const id = formData.get("accountId") as string
    deleteAccount.mutate({
      id,
    })
  }

  const handleSessionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const id = formData.get("sessionId") as string
    deleteSession.mutate({
      id,
    })
  }

  return (
    <div className="py-4">
      <section className="mb-20 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
        <FormCard
          handleSubmit={handleUserSubmit}
          label="USER ID"
          inputName="userId"
          placeholder="Input User ID"
          buttonText="Delete User"
        />
        <FormCard
          handleSubmit={handleEOSubmit}
          label="EO ID"
          inputName="eoId"
          placeholder="Input EO ID"
          buttonText="Delete EO"
        />
        <FormCard
          handleSubmit={handleAccountSubmit}
          label="Account ID"
          inputName="accountId"
          placeholder="Input Account ID"
          buttonText="Delete Account"
        />
        <FormCard
          handleSubmit={handleSessionSubmit}
          label="Session ID"
          inputName="sessionId"
          placeholder="Input Session ID"
          buttonText="Delete Session"
        />
      </section>
      <div className="my-8 text-center">
        <Button
          className="font-bold"
          size="lg"
          variant="destructive"
          onClick={() => deleteAllEventOrganizer.mutate()}
        >
          Delete All Event Organizer
        </Button>
      </div>
      <section>
        <div className="mt-8">
          <h2 className="text-3xl font-bold text-amber-300">
            Get All Accounts
          </h2>
          {getAllAccount.status === "loading" && <LoadingSpinner />}
          {getAllAccount.status === "error" && <p>An Error occured</p>}
          {getAllAccount.status === "success" && (
            <div>
              <pre>
                <code>{JSON.stringify(getAllAccount.data, null, 4)}</code>
              </pre>
            </div>
          )}
        </div>
        <div className="mt-8">
          <h2 className="text-3xl font-bold text-amber-300">
            Get All Event Organizers
          </h2>
          {status === "loading" && <LoadingSpinner />}
          {status === "error" && <p>An Error occured</p>}
          <div>
            <pre>
              <code>
                {status === "success" && (
                  <pre>{JSON.stringify(data, null, 4)}</pre>
                )}
              </code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  )
}
