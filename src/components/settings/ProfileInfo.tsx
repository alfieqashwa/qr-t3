import { User } from "lucide-react";
import Image from "next/image";
import { AdminAndDewaOnly } from "../Authed/AdminAndDewaOnly";
import { api } from "@/src/utils/api";
import { Skeleton } from "../ui/skeleton";

export function ProfileInfo() {
  const { data: profile, isLoading } = api.user.me.useQuery();

  if (isLoading) {
    return <Skeleton className="mx-auto h-96 w-full" />;
  }
  return (
    <div className="mx-auto w-full">
      <h1 className="text-2xl font-semibold capitalize leading-none tracking-tight">
        {profile?.name}
      </h1>
      <h4 className="mt-2 text-slate-400">Information of user profile</h4>
      <div className="mt-4 border-t-2 border-slate-800"></div>
      <section className="mt-4 rounded-md border-4 border-slate-800 p-8">
        {!!profile ? (
          <article className="flex flex-col items-center space-y-6">
            <div className="mx-auto">
              {!!profile.image && !!profile.name ? (
                <Image
                  src={profile.image}
                  alt={profile.name}
                  width={128}
                  height={128}
                  className="rounded-full ring-4 ring-amber-300 ring-offset-2 ring-offset-slate-600"
                />
              ) : (
                <div className="rounded-full p-4 ring-4 ring-amber-300 ring-offset-2 ring-offset-slate-600">
                  <User size={128} />
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="space-x-2">
                <small className="font-semibold capitalize">role:</small>
                <small className="font-semibold">{profile.role}</small>
              </div>
              <p className="mt-2 font-semibold">
                Login as <span>{profile.email as string}</span>
              </p>
              <AdminAndDewaOnly>
                <div className="mt-2 space-x-2">
                  <small className="font-semibold capitalize">id:</small>
                  <small className="font-semibold capitalize">
                    {profile.id}
                  </small>
                  <small className="text-rose-400">
                    ✅ only Dewa and Admin who can see ID!
                  </small>
                </div>
              </AdminAndDewaOnly>
            </div>
          </article>
        ) : null}
      </section>
    </div>
  );
}
