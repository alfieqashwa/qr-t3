import { Loader2, User as UserIcon } from "lucide-react"
import { UserProfile } from "./user-profile"

type UserAvatarProps = {
  isLoading: boolean
  userImageUpdate?: string | null
  userImage?: string | null
}

export const UserAvatar = ({
  isLoading,
  userImage,
  userImageUpdate,
}: UserAvatarProps): JSX.Element => {
  if (isLoading) return <Loader2 className="animate-spin" />

  const image = !!userImageUpdate ? userImageUpdate : (userImage as string)
  const userAvatar =
    !userImageUpdate && !userImage ? (
      <UserIcon />
    ) : (
      <UserProfile image={image} />
    )

  return <>{userAvatar}</>
}
