import { Bell, Codesandbox, Menu, Settings, User } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import type { ReactNode } from "react";
import { Header } from "./Header";

type LayoutProps = { title?: string; children: ReactNode };

export const LayoutDashboard = ({
  title = "Default",
  children,
}: LayoutProps): JSX.Element => {
  const titleHeader = `QR Ticket Concert | ${title}`;

  const { data: sessionData } = useSession();
  // const router = useRouter()

  // console.log(`ROUTER::: `, JSON.stringify(router, null, 2))

  // const userEmail = sessionData?.user.email
  const userImage = sessionData?.user?.image;
  // console.log(userEmail)

  return (
    <>
      <Header titleHeader={titleHeader} />
      <div className="container relative min-w-max max-w-full bg-gradient-to-b from-black to-slate-900 text-zinc-50">
        <NavigationHeader image={userImage as string} />
        <Drawer />
        <main className="mx-auto ml-[256px] min-h-screen max-w-full py-4">
          {children}
        </main>
      </div>
    </>
  );
};

type NavigationProps = {
  image?: string;
};

const NavigationHeader = (props: NavigationProps) => (
  <nav className="fixed z-50 flex h-16 w-full">
    <section className="flex h-16 min-w-[256px] items-center justify-end space-x-8 pr-6">
      <div className="flex w-full items-center justify-around">
        <Codesandbox size={36} />
        <h2 className="text-lg font-bold">LOGO</h2>
      </div>
      <Menu size={32} />
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

const Drawer = () => (
  <aside className="fixed z-30 min-h-screen w-[256px] bg-gradient-to-b from-zinc-900 to-slate-900">
    <ul className="mt-20">
      <li className="mx-2 flex items-center space-x-6 rounded-xl px-4 py-3 transition duration-150 ease-in-out hover:bg-zinc-800">
        <Settings />
        <h3 className="font-semibold tracking-wider">Home</h3>
      </li>
      <li className="mx-2 flex items-center space-x-6 rounded-xl px-4 py-3 transition duration-150 ease-in-out hover:bg-zinc-800">
        <Settings />
        <h3 className="font-semibold tracking-wider">Events</h3>
      </li>
      <li className="mx-2 flex items-center space-x-6 rounded-xl px-4 py-3 transition duration-150 ease-in-out hover:bg-zinc-800">
        <Settings />
        <h3 className="font-semibold tracking-wider">Visitors</h3>
      </li>
      <li className="mx-2 flex items-center space-x-6 rounded-xl px-4 py-3 transition duration-150 ease-in-out hover:bg-zinc-800">
        <Settings />
        <h3 className="font-semibold tracking-wider">Settings</h3>
      </li>
    </ul>
  </aside>
);
