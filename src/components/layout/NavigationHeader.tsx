"use client";

import { api } from "@/src/utils/api";
import useToggleStore from "@/store/useToggle";
import {
  Bell,
  Codesandbox,
  Loader2,
  SidebarClose,
  SidebarOpen,
  User,
} from "lucide-react";
import { UserProfile } from "./UserProfile";

export const NavigationHeader = () => {
  const { toggle, handleToggle } = useToggleStore();

  const { data: me, isLoading } = api.user.me.useQuery(undefined, {});
  const userImage = me?.image;
  const userImageUpdate = me?.imageUpdate;

  return (
    <nav className="fixed z-50 flex h-20 w-full justify-between border-b-2 border-slate-700 bg-gradient-to-br from-slate-800 via-black to-slate-800">
      <section className="flex h-16 min-w-[256px] items-center justify-end space-x-8 pr-6">
        <div className="flex w-full items-center justify-around">
          <Codesandbox size={36} />
          <h2 className="text-lg font-bold">LOGO</h2>
        </div>
        <button
          className="rounded-full bg-zinc-900 p-2.5 transition duration-300 ease-in-out hover:bg-zinc-800"
          onClick={handleToggle}
        >
          {toggle ? (
            <SidebarClose className="text-amber-200" />
          ) : (
            <SidebarOpen className="text-amber-200" />
          )}
        </button>
      </section>
      <section className="flex w-full items-center justify-end space-x-8 px-8">
        <Bell />
        <UserAvatar
          isLoading={isLoading}
          userImage={userImage}
          userImageUpdate={userImageUpdate}
        />
      </section>
    </nav>
  );
};

type UserAvatarProps = {
  isLoading: boolean;
  userImageUpdate?: string | null;
  userImage?: string | null;
};
const UserAvatar = ({
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
);
