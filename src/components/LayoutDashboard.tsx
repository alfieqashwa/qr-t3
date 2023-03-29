import {
  Bell,
  Codesandbox,
  Settings,
  SidebarClose,
  SidebarOpen,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import type { ReactNode } from "react";
import { useState } from "react";
import { Header } from "./Header";

type LayoutProps = { title?: string; children: ReactNode };

export const LayoutDashboard = ({
  title = "Default",
  children,
}: LayoutProps): JSX.Element => {
  const { data: sessionData } = useSession();
  const userImage = sessionData?.user?.image;

  const titleHeader = `QR Ticket Concert | ${title}`;
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
          className={`${
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

type NavigationProps = {
  image?: string;
  isToggle: boolean;
  setIsToggle: React.Dispatch<React.SetStateAction<boolean>>;
};

const NavigationHeader = (props: NavigationProps) => (
  <nav className="border-br fixed z-50 flex h-20 w-full justify-between border-slate-900 bg-gradient-to-br from-slate-800 via-black to-slate-800">
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

type DrawerProps = {
  isToggle: boolean;
};

const Drawer = ({ isToggle }: DrawerProps) => (
  <aside
    className={`fixed z-30 min-h-screen border-r border-slate-900 bg-gradient-to-b from-black to-slate-900 pt-28 ${
      isToggle ? "w-[128px]" : "w-[256px]"
    }`}
  >
    <ul>
      <li className="mx-2 flex items-center space-x-6 rounded-xl px-4 py-3 transition duration-150 ease-in-out hover:bg-zinc-800">
        <Settings className={`${isToggle ? "mx-auto" : ""}`} />
        {!isToggle && <h3 className="font-semibold tracking-wider">Home</h3>}
      </li>
      <li className="mx-2 flex items-center space-x-6 rounded-xl px-4 py-3 transition duration-150 ease-in-out hover:bg-zinc-800">
        <Settings className={`${isToggle ? "mx-auto" : ""}`} />
        {!isToggle && <h3 className="font-semibold tracking-wider">Events</h3>}
      </li>
      <li className="mx-2 flex items-center space-x-6 rounded-xl px-4 py-3 transition duration-150 ease-in-out hover:bg-zinc-800">
        <Settings className={`${isToggle ? "mx-auto" : ""}`} />
        {!isToggle && (
          <h3 className="font-semibold tracking-wider">Visitors</h3>
        )}
      </li>
      <li className="mx-2 flex items-center space-x-6 rounded-xl px-4 py-3 transition duration-150 ease-in-out hover:bg-zinc-800">
        <Settings className={`${isToggle ? "mx-auto" : ""}`} />
        {!isToggle && (
          <h3 className="font-semibold tracking-wider">Settings</h3>
        )}
      </li>
    </ul>
  </aside>
);
