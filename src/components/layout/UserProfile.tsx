import { Fish, Settings, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "~/components/ui/menubar";

const AVATAR_MENU_LIST = [
  { title: "Home", href: "/", disabled: false, icon: <Fish size={16} /> },
  {
    title: "Profile",
    href: "/profile",
    disabled: true,
    icon: <User size={18} />,
  },
  {
    title: "Settings",
    href: "/settings",
    disabled: false,
    icon: <Settings size={16} />,
  },
] as const;

export const UserProfile = ({ image }: { image: string }) => (
  <Menubar className="h-12 w-12 items-center justify-center rounded-full border-2 border-amber-300 p-0 transition duration-300 ease-in-out hover:border-amber-300">
    <MenubarMenu>
      <MenubarTrigger className="rounded-full px-0 py-0 hover:cursor-pointer">
        <Image
          src={image}
          alt="User Avatar"
          width={44}
          height={44}
          className="rounded-full"
        />
      </MenubarTrigger>
      <MenubarContent>
        {AVATAR_MENU_LIST?.map((menu, i) => {
          const { title, href, disabled, icon: Icon } = menu;
          return (
            <Link href={href} key={`${i}_${title}`}>
              <MenubarItem
                disabled={disabled}
                className="group hover:cursor-pointer"
              >
                {title}
                <MenubarShortcut className="text-amber-200 transition duration-300 ease-in-out group-hover:text-amber-300">
                  {Icon}
                </MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
            </Link>
          );
        })}
        <MenubarItem onClick={() => signOut()} className="hover:cursor-pointer">
          Sign Out <MenubarShortcut></MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
);
