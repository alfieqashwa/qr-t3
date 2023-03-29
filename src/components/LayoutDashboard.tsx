"use client";

import { useSession } from "next-auth/react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Drawer } from "./Drawer";
import { Header } from "./Header";
import { NavigationHeader } from "./NavigationHeader";

type LayoutProps = { title: string; children: ReactNode };

export const LayoutDashboard = ({
  title,
  children,
}: LayoutProps): JSX.Element => {
  const { data: sessionData } = useSession();
  const userImage = sessionData?.user?.image;

  const titleHeader = `${title} | QR Ticket Concert`;
  const [isToggle, setIsToggle] = useState(false);

  return (
    <>
      <Header titleHeader={titleHeader} />
      <div className="container relative min-w-fit max-w-full bg-gradient-to-b from-black to-slate-900 text-zinc-50">
        <NavigationHeader
          image={userImage as string}
          isToggle={isToggle}
          setIsToggle={setIsToggle}
        />
        <Drawer isToggle={isToggle} />
        {/* STARTS MAIN */}
        <main
          className={`min-h-screen ${
            isToggle ? "ml-[128px]" : "ml-[256px]"
          } px-8 py-8 pt-28`}
        >
          {children}
        </main>
        {/* ENDS MAIN */}
      </div>
    </>
  );
};
