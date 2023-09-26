import { signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "~/components/ui/menubar"
import { MENU_LINKS } from "../menu-list"
import { Home, LogOut } from "lucide-react"
import { useRouter } from "next/router"

type UserProfileProps = {
  slug: string
  image: string
}

export const UserProfile = ({ slug, image }: UserProfileProps) => {
  const { pathname } = useRouter()
  return (
    <Menubar className="h-12 w-12 items-center justify-center rounded-full border-2 border-foreground/50 p-0 transition-colors duration-300 ease-in-out hover:border-foreground/75">
      <MenubarMenu>
        <MenubarTrigger className="relative h-10 w-10 rounded-full px-0 py-0 hover:cursor-pointer">
          <Image src={image} alt="User Avatar" fill className="rounded-full" />
        </MenubarTrigger>
        <MenubarContent className="w-52">
          <HomeMenu />
          {MENU_LINKS?.map((link) => {
            const { path, iconSmall: Icon } = link
            return (
              <Link href={`/${slug}/${path}`} key={path}>
                <MenubarItem
                  className={`group capitalize hover:cursor-pointer
                    ${
                      pathname === `/[slug]/${path}`
                        ? "bg-secondary text-amber-300"
                        : ""
                    }`}
                >
                  {path}
                  <MenubarShortcut
                    className={`transition duration-300 ease-in-out ${
                      pathname === `/[slug]/${path}`
                        ? "text-amber-300"
                        : "text-foreground"
                    }`}
                  >
                    {Icon}
                  </MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
              </Link>
            )
          })}
          <MenubarItem
            onClick={() => signOut()}
            className="hover:cursor-pointer"
          >
            Sign Out
            <MenubarShortcut className="text-foreground transition duration-300 ease-in-out group-hover:text-foreground">
              <LogOut size={18} className="shrink-0" />
            </MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

// Add Home Menu
const HomeMenu = (): JSX.Element => (
  <Link href="/">
    <MenubarItem className="group capitalize hover:cursor-pointer">
      home
      <MenubarShortcut className="text-foreground transition duration-300 ease-in-out group-hover:text-foreground">
        <Home size={18} />
      </MenubarShortcut>
    </MenubarItem>
    <MenubarSeparator />
  </Link>
)
