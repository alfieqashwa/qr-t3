import { ArrowBigLeft, ArrowBigRight, Bell, Codesandbox } from "lucide-react"
import { cn } from "~/src/utils"
import { api } from "~/src/utils/api"
import useToggleStore from "~/store/useToggle"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/ui/tooltip"
import { ThemeToggle } from "./theme-toggle"
import { UserAvatar } from "./user-avatar"

export const NavigationHeader = () => {
  const { toggle, handleToggle } = useToggleStore()

  const { data: me, isLoading } = api.user.me.useQuery(undefined, {})
  const userImage = me?.image
  const userImageUpdate = me?.imageUpdate

  return (
    <nav className="fixed z-50 flex h-20 w-full max-w-[120rem] justify-between border-b-2 border-slate-800 bg-background">
      <section className="z-40 flex h-16 items-center justify-end space-x-8 pl-6">
        <div className="flex w-full items-center justify-around">
          <Codesandbox size={36} className="animate-spin" />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <button
                className={cn(
                  "hidden rounded-full p-2.5 transition-transform duration-300 ease-in-out lg:block",
                  toggle && "text-primary transition-colors",
                )}
                onClick={handleToggle}
              >
                {!toggle ? <ArrowBigRight /> : <ArrowBigLeft />}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{!toggle ? "Expand" : "Shrink"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </section>
      <section className="flex w-full items-center justify-end space-x-4 px-4 lg:px-8">
        <Bell />
        <ThemeToggle />
        <UserAvatar
          isLoading={isLoading}
          userImage={userImage}
          userImageUpdate={userImageUpdate}
        />
      </section>
    </nav>
  )
}
