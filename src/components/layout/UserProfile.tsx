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
import { MENU_LINKS } from "./MenuList";
import { LogOut } from "lucide-react";

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
        {MENU_LINKS?.map((link) => {
          const { path, iconSmall: Icon } = link;
          return (
            <Link href={`/${path}`} key={path}>
              <MenubarItem className="group capitalize hover:cursor-pointer">
                {path}
                <MenubarShortcut className="text-amber-200 transition duration-300 ease-in-out group-hover:text-amber-300">
                  {Icon}
                </MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
            </Link>
          );
        })}
        <MenubarItem onClick={() => signOut()} className="hover:cursor-pointer">
          Sign Out
          <MenubarShortcut className="text-amber-200 transition duration-300 ease-in-out group-hover:text-amber-300">
            <LogOut size={18} className="shrink-0" />
          </MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
);
