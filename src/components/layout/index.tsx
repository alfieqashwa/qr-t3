"use client";

import type { ReactNode } from "react";
import { Drawer } from "./Drawer";
import { Header } from "./Header";
import { NavigationHeader } from "./NavigationHeader";
import useToggleStore from "@/store/useToggle";
import { cn } from "@/src/utils";

type LayoutProps = { title: string; children: ReactNode };

export const Layout = ({ title, children }: LayoutProps) => {
  const { toggle } = useToggleStore();

  const titleHeader = `${title} | QR Ticket Concert`;

  return (
    <>
      <Header titleHeader={titleHeader} />
      <div>
        <NavigationHeader />
        <Drawer />
        {/* STARTS MAIN */}
        <main
          className={cn(
            "ml-[256px] px-8 pt-24 transition-all duration-500 ease-in-out",
            toggle ? "" : "-translate-x-[128px]"
          )}
        >
          {children}
        </main>
        {/* ENDS MAIN */}
      </div>
    </>
  );
};
