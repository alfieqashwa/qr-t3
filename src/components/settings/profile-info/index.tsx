import { UploadDropzone } from "@uploadthing/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { LoadingSpinner } from "~/components/loading"
import type { OurFileRouter } from "~/server/uploadthing/router"
import { ToastAction } from "~/ui/toast"
import { toast } from "~/ui/use-toast"
import { api } from "~/utils/api"
import { wait } from "~/utils/wait"
import { HeaderSettings } from "../header-settings"
import { ProfileImage } from "./profile-image"
import { UpdateRole } from "./update-role"
import { Button } from "../../ui/button"

export function ProfileInfo(): JSX.Element {
  const router = useRouter()
  const slug = router.query.slug as string

  const { data: profile, isLoading } = api.user.me.useQuery()
  const utils = api.useUtils()
  const { mutate, error } = api.user.updateImageProfile.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Upload Completed",
      })
      await utils.user.me.invalidate()
      await wait().then(() => router.reload())
    },
    onError() {
      console.error(
        `ERROR_UPDATE_IMAGE`,
        error?.data?.zodError?.fieldErrors.updateImage as string[]
      )
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    },
  })

  if (isLoading) return <LoadingSpinner />
  return (
    <div className="mx-auto w-full">
      <div className="flex items-center justify-between">
        <HeaderSettings
          title={profile?.name as string}
          subTitle="Information of User Profile"
        />
        {profile?.role === "DEWA" && (
          <Link
            href={`/${slug}/dewa`}
            // className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Button variant="destructive" size="sm">
              Go to Dewa
            </Button>
          </Link>
        )}
      </div>
      <div className="mt-4 border-t-2"></div>
      <section className="mt-4 rounded-lg border-2 p-8">
        {!!profile && (
          <article className="flex flex-col items-center space-y-6">
            <ProfileImage profile={profile} />
            <div className="space-x-2 text-center">
              <small className="text-sm font-medium capitalize lg:text-base lg:font-semibold">
                role:
              </small>
              <small className="text-sm font-medium lg:text-base lg:font-semibold">
                {profile.role}
              </small>
            </div>
            {profile.email === process.env.NEXT_PUBLIC_DEWA && (
              <UpdateRole
                id={profile.id}
                username={profile.name}
                currentRole={profile.role}
              />
            )}
            <div>
              <small className="text-sm font-medium lg:text-base lg:font-semibold">
                Login as <span>{profile.email}</span>
              </small>
            </div>
          </article>
        )}
        <div className="mx-auto w-1/2 whitespace-nowrap hover:cursor-pointer">
          <UploadDropzone<OurFileRouter>
            endpoint="withMdwr"
            onClientUploadComplete={(res) => {
              // Do something with the response
              // console.log("Files: ", res);
              const imageUpdate = res?.[0]?.fileUrl as string
              mutate({
                imageUpdate,
              })
            }}
            onUploadError={(error: Error) => {
              console.error(`ERROR! ${error.message}`)
            }}
          />
        </div>
      </section>
    </div>
  )
}
