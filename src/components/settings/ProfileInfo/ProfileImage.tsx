import { User } from "lucide-react";
import Image from "next/image";
import type { RouterOutputs } from "~/src/utils/api";

type ProfileImageProps = {
  profile: RouterOutputs["user"]["me"];
};

export const ProfileImage = ({ profile }: ProfileImageProps): JSX.Element => {
  const imageUpdate = profile?.imageUpdate as string;
  const image = profile?.image as string;
  const name = profile?.name as string;
  const isImageUpdateExist = !!profile?.imageUpdate;
  return (
    <div className="mx-auto">
      {isImageUpdateExist ? (
        <div className="relative h-28 w-28 md:h-36 md:w-36">
          <Image
            src={isImageUpdateExist ? imageUpdate : image}
            alt={name}
            fill
            className="rounded-full ring-4 ring-amber-300 ring-offset-2 ring-offset-slate-600"
          />
        </div>
      ) : (
        <div className="rounded-full p-4 ring-4 ring-amber-300 ring-offset-2 ring-offset-slate-600">
          <User size={128} />
        </div>
      )}
    </div>
  );
};
