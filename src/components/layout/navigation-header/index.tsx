import { Bell, Codesandbox, SidebarClose, SidebarOpen } from "lucide-react";
import { api } from "~/src/utils/api";
import useToggleStore from "~/store/useToggle";
import { UserAvatar } from "./user-avatar";
import { ThemeToggle } from "./theme-toggle";

export const NavigationHeader = () => {
  const { toggle, handleToggle } = useToggleStore();

  const { data: me, isLoading } = api.user.me.useQuery(undefined, {});
  const userImage = me?.image;
  const userImageUpdate = me?.imageUpdate;

  return (
    <nav className="fixed z-50 flex h-20 w-full justify-between border-b-2 bg-background">
      <section className="z-40 flex h-16 items-center justify-end space-x-8 pl-6">
        <div className="flex w-full items-center justify-around">
          <Codesandbox size={36} className="animate-spin" />
        </div>
        <button
          className="hidden rounded-full p-2.5 transition duration-300 ease-in-out lg:block"
          onClick={handleToggle}
        >
          {toggle ? (
            <SidebarClose className="" />
          ) : (
            <SidebarOpen className="" />
          )}
        </button>
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
  );
};
