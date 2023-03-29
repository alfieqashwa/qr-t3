"use client";

import {
  Bell,
  Codesandbox,
  SidebarClose,
  SidebarOpen,
  User,
} from "lucide-react";
import Image from "next/image";

type NavigationProps = {
  image?: string;
  isToggle?: boolean;
  setIsToggle: React.Dispatch<React.SetStateAction<boolean | undefined>>;
};

export const NavigationHeader = (props: NavigationProps) => (
  <nav className="fixed z-50 flex h-20 w-full justify-between border-b-2 border-slate-700 bg-gradient-to-br from-slate-800 via-black to-slate-800">
    <section className="flex h-16 min-w-[256px] items-center justify-end space-x-8 pr-6">
      <div className="flex w-full items-center justify-around">
        <Codesandbox size={36} />
        <h2 className="text-lg font-bold">LOGO</h2>
      </div>
      <button
        className="rounded-full bg-slate-800 p-2.5 transition duration-300 ease-in-out hover:bg-slate-700"
        onClick={() => props.setIsToggle((t) => !t)}
      >
        {props.isToggle ? <SidebarOpen /> : <SidebarClose />}
      </button>
    </section>
    <section className="flex w-full items-center justify-end space-x-8 px-8">
      <Bell />
      {props.image ? (
        <Image
          src={props.image}
          alt="profile"
          width={32}
          height={32}
          className="ring-offset rounded-full ring-2 ring-purple-500"
        />
      ) : (
        <User />
      )}
    </section>
  </nav>
);
