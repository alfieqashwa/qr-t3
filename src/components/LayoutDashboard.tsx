"use client";

import { useSession } from "next-auth/react";
import type { ReactNode } from "react";
import { Drawer } from "./Drawer";
import { Header } from "./Header";
import { NavigationHeader } from "./NavigationHeader";
import useToggleStore from "@/store/useToggle";

type LayoutProps = { title: string; children: ReactNode };

export const LayoutDashboard = ({ title, children }: LayoutProps) => {
  const { toggle } = useToggleStore();

  const { data: sessionData } = useSession();
  const userImage = sessionData?.user?.image;

  const titleHeader = `${title} | QR Ticket Concert`;

  return (
    <>
      <Header titleHeader={titleHeader} />
      <div className="container relative min-w-fit max-w-full bg-gradient-to-b from-black to-slate-900 text-zinc-50">
        <NavigationHeader image={userImage as string} />
        <Drawer />
        {/* STARTS MAIN */}
        <main
          className={`ml-[256px] min-h-screen transition-all duration-500 ease-in-out ${
            toggle ? "-translate-x-[128px]" : ""
          } px-8 py-8 pt-28`}
        >
          {children}
        </main>
        {/* ENDS MAIN */}
      </div>
    </>
  );
};
