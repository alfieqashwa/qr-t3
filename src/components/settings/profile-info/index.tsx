import { UploadDropzone } from "@uploadthing/react";
import { useRouter } from "next/router";
import { LoadingSpinner } from "~/components/loading";
import type { OurFileRouter } from "~/server/uploadthing/router";
import { ToastAction } from "~/ui/toast";
import { toast } from "~/ui/use-toast";
import { api } from "~/utils/api";
import { wait } from "~/utils/wait";
import { HeaderSettings } from "../header-settings";
import { ProfileImage } from "./profile-image";

export function ProfileInfo(): JSX.Element {
  const router = useRouter();

  const { data: profile, isLoading } = api.user.me.useQuery();
  const utils = api.useContext();
  const { mutate, error } = api.user.updateImageProfile.useMutation({
    async onSuccess() {
      toast({
        title: "Succeed!",
        variant: "default",
        description: "Upload Completed",
      });
      await utils.user.me.invalidate();
      await wait().then(() => router.reload());
    },
    onError() {
      console.error(
        `ERROR_UPDATE_IMAGE`,
        error?.data?.zodError?.fieldErrors.updateImage as string[]
      );
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="mx-auto w-full">
      <HeaderSettings
        title={profile?.name as string}
        subTitle="Information of user profile"
      />
      <div className="mt-4 border-t-2 border-slate-800"></div>
      <section className="mt-4 rounded-md border-4 border-slate-800 p-8">
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
              const imageUpdate = res?.[0]?.fileUrl as string;
              mutate({
                imageUpdate,
              });
            }}
            onUploadError={(error: Error) => {
              console.error(`ERROR! ${error.message}`);
            }}
          />
        </div>
      </section>
    </div>
  );
}
