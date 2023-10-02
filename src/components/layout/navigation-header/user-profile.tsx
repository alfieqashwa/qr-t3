import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext } from "react"
import { linkList } from "~/src/constants/link-list"
import { SlugContext } from "~/store/slug-context-provider"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "~/ui/menubar"

type TLink = "" | "home" | "dashboard" | "event" | "visitor" | "settings"
type TMenuLink = {
  path: Exclude<TLink, "home">
  title: Exclude<TLink, "">
  iconSmall: JSX.Element
}

type CustomLinkProps = {
  link: TMenuLink
  pathname: string
}

const CustomLink = ({ link, pathname }: CustomLinkProps) => {
  const { slug } = useContext(SlugContext)
  return (
    <Link href={`/${slug as string}/${link.path}`}>
      <MenubarItem
        className={`group capitalize hover:cursor-pointer
                    ${
                      pathname === `/[slug]/${link.path}`
                        ? "bg-secondary text-amber-300"
                        : ""
                    }`}
      >
        {link.title}
        <MenubarShortcut
          className={`transition duration-300 ease-in-out ${
            pathname === `/[slug]/${link.path}`
              ? "text-amber-300"
              : "text-foreground"
          }`}
        >
          {link.iconSmall}
        </MenubarShortcut>
      </MenubarItem>
      <MenubarSeparator />
    </Link>
  )
}

export const UserProfile = ({ image }: { image: string }) => {
  const { pathname } = useRouter()

  const destkopViewLink = linkList
    ?.filter((f) => f.title === "home" || f.title === "settings")
    ?.map((link, i) => {
      return (
        <div className="hidden lg:block" key={i}>
          <CustomLink link={link as TMenuLink} pathname={pathname} />
        </div>
      )
    })

  const mobileViewLink = linkList?.map((link, i) => {
    return (
      <div className="lg:hidden" key={i}>
        <CustomLink link={link as TMenuLink} pathname={pathname} />
      </div>
    )
  })

  return (
    <Menubar className="h-12 w-12 items-center justify-center rounded-full border-2 border-foreground/50 p-0 transition-colors duration-300 ease-in-out hover:border-foreground/75">
      <MenubarMenu>
        <MenubarTrigger className="relative h-10 w-10 rounded-full px-0 py-0 hover:cursor-pointer">
          <Image src={image} alt="User Avatar" fill className="rounded-full" />
        </MenubarTrigger>
        <MenubarContent className="mr-2 mt-3.5 w-52">
          {destkopViewLink}
          {mobileViewLink}
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
