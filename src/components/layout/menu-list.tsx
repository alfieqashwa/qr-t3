import useToggleStore from "~/src/store/useToggle"
import { cn } from "~/src/utils"
import { titleVariant } from "~/src/utils/motion"
import { motion } from "framer-motion"
import { Calendar, LayoutDashboard, Settings, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"

export const MENU_LINKS = [
  {
    path: "dashboard",
    iconDefault: <LayoutDashboard className="shrink-0" />,
    iconSmall: <LayoutDashboard size={18} className="shrink-0" />,
  },
  {
    path: "event",
    iconDefault: <Calendar className="shrink-0" />,
    iconSmall: <Calendar size={18} className="shrink-0" />,
  },
  {
    path: "visitor",
    iconDefault: <Users className="shrink-0" />,
    iconSmall: <Users size={18} className="shrink-0" />,
  },
  {
    path: "settings",
    iconDefault: <Settings className="shrink-0" />,
    iconSmall: <Settings size={18} className="shrink-0" />,
  },
] as const

export const MenuList = (): JSX.Element => {
  const { toggle } = useToggleStore()
  const { pathname } = useRouter()
  return (
    <ul className="mt-8 space-y-2 px-1.5">
      {MENU_LINKS?.map((link) => (
        <li
          className={`rounded-xl border-b-2 border-r-2 ${
            pathname === `/${link.path}` ? "bg-muted" : "bg-background"
          }`}
          key={link.path}
        >
          <Link
            href={`/${link.path}`}
            className={cn(
              "flex items-center rounded-xl py-3 transition duration-150 ease-in-out hover:bg-accent hover:text-foreground",
              toggle
                ? "flex-row space-x-6 px-6"
                : "flex-col justify-end space-y-3 px-2"
            )}
          >
            {link.iconDefault}
            {/* <LayoutDashboard className="shrink-0" /> */}
            <motion.h3
              initial={toggle ? "initialOpen" : "initialClose"}
              animate={toggle ? "open" : "close"}
              variants={titleVariant}
              className="font-semibold capitalize tracking-wider"
            >
              {link.path}
            </motion.h3>
          </Link>
        </li>
      ))}
    </ul>
  )
}
