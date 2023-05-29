import type { User } from "@prisma/client";
import { User as UserIcon } from "lucide-react";
import Image from "next/image";
import type { RouterOutputs } from "~/src/utils/api";

type ProfileImageProps = {
  profile: RouterOutputs["user"]["me"];
};

export const ProfileImage = ({ profile }: ProfileImageProps): JSX.Element => {
  const { image, name, imageUpdate } = profile as User;

  if (typeof image !== "string" || typeof name !== "string")
    return (
      <div className="rounded-full p-4 ring-4 ring-amber-300 ring-offset-2 ring-offset-slate-600">
        <UserIcon size={128} />
      </div>
    );

  return (
    <div className="mx-auto">
      <div className="relative h-28 w-28 lg:h-36 lg:w-36">
        <Image
          src={imageUpdate ?? image}
          alt={name}
          fill
          className="rounded-full ring-4 ring-amber-300 ring-offset-2 ring-offset-slate-600"
        />
      </div>
    </div>
  );
};
