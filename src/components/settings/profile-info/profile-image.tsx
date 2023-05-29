import type { User } from "@prisma/client";
import Image from "next/image";
import type { RouterOutputs } from "~/src/utils/api";

type ProfileImageProps = {
  profile: RouterOutputs["user"]["me"];
};

export const ProfileImage = ({
  profile,
}: ProfileImageProps): JSX.Element | null => {
  const { image, name, imageUpdate } = profile as User;

  if (typeof image !== "string" || typeof name !== "string") return null;

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
