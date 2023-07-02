import { Loader2, User } from "lucide-react"
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
}: UserAvatarProps) => (
  <>
    {isLoading ? (
      <Loader2 size={24} className="animate-spin" />
    ) : !!userImageUpdate ? (
      <UserProfile image={userImageUpdate} />
    ) : !!userImage ? (
      <UserProfile image={userImage} />
    ) : (
      <User />
    )}
  </>
)
