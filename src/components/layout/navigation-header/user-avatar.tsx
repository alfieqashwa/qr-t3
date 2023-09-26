import { Loader2, User } from "lucide-react"
import { UserProfile } from "./user-profile"

type UserAvatarProps = {
  slug: string
  isLoading: boolean
  userImageUpdate?: string | null
  userImage?: string | null
}
export const UserAvatar = ({
  slug,
  isLoading,
  userImage,
  userImageUpdate,
}: UserAvatarProps) => (
  <>
    {isLoading ? (
      <Loader2 size={24} className="animate-spin" />
    ) : !!userImageUpdate ? (
      <UserProfile slug={slug} image={userImageUpdate} />
    ) : !!userImage ? (
      <UserProfile slug={slug} image={userImage} />
    ) : (
      <User />
    )}
  </>
)
